import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  private productServiceUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productServiceUrl = this.configService.get<string>(
      'PRODUCT_SERVICE_URL',
      'http://localhost:3002',
    );
  }

  /**
   * Fetch product details from Product Service
   */
  private async getProductFromService(productId: number) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products/${productId}`),
      );
      return data;
    } catch (error) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return { cart: null, items: [] };
    }

    // Fetch product details for each item from Product Service
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const product = await this.getProductFromService(item.product_id);
          return {
            ...item,
            product_name: product.name,
            product_price: product.price,
            subtotal: product.price * item.quantity,
          };
        } catch {
          return {
            ...item,
            product_name: 'Unknown Product',
            product_price: 0,
            subtotal: 0,
          };
        }
      }),
    );

    return {
      cart_id: cart.id,
      items: itemsWithProducts,
    };
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    // Check product exists and stock availability from Product Service
    const product = await this.getProductFromService(dto.product_id);

    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Requested quantity (${dto.quantity}) exceeds available stock (${product.stock})`,
      );
    }

    // Get or create cart for user
    let cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
        include: { items: true },
      });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product_id === dto.product_id,
    );

    if (existingItem) {
      throw new BadRequestException('Product already exists in cart');
    }

    // Add item to cart
    const cartItem = await this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
      },
    });

    return {
      message: 'Item added to cart',
      item: cartItem,
    };
  }

  async updateCartItem(userId: number, productId: number, dto: UpdateCartDto) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find((item) => item.product_id === productId);

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    // Check stock from Product Service
    const product = await this.getProductFromService(productId);

    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Requested quantity (${dto.quantity}) exceeds available stock (${product.stock})`,
      );
    }

    const updatedItem = await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: dto.quantity },
    });

    return {
      message: 'Cart item updated',
      item: updatedItem,
    };
  }

  async removeCartItem(userId: number, productId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find((item) => item.product_id === productId);

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return { message: 'Cart cleared' };
  }

  /**
   * Get cart items for checkout (used by OrdersService)
   */
  async getCartForCheckout(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    return cart;
  }
}
