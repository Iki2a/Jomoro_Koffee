import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  private productServiceUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly cartService: CartService,
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

  /**
   * Call Product Service to reduce stock (internal endpoint)
   */
  private async reduceProductStock(productId: number, quantity: number) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.productServiceUrl}/internal/products/${productId}/reduce-stock`,
          { quantity },
        ),
      );
      return data;
    } catch (error) {
      throw new BadRequestException(
        `Failed to reduce stock for product ${productId}`,
      );
    }
  }

  async getOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: { details: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderDetail(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      include: { details: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Fetch product data from Product Service for each detail
    const detailsWithProducts = await Promise.all(
      order.details.map(async (detail) => {
        try {
          const product = await this.getProductFromService(detail.product_id);
          return {
            ...detail,
            product_name: product.name,
            product_description: product.description,
          };
        } catch {
          return {
            ...detail,
            product_name: 'Unknown Product',
            product_description: '',
          };
        }
      }),
    );

    return {
      ...order,
      details: detailsWithProducts,
    };
  }

  async checkout(userId: number) {
    // Get user's cart
    const cart = await this.cartService.getCartForCheckout(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Fetch prices from Product Service and prepare order details
    const orderDetailsData = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.getProductFromService(item.product_id);
        return {
          product_id: item.product_id,
          price: product.price,
          quantity: item.quantity,
        };
      }),
    );

    // Create order with details
    const order = await this.prisma.order.create({
      data: {
        user_id: userId,
        details: {
          create: orderDetailsData,
        },
      },
      include: { details: true },
    });

    // Reduce stock for each item via Product Service
    for (const item of cart.items) {
      await this.reduceProductStock(item.product_id, item.quantity);
    }

    // Clear cart after successful checkout
    await this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return {
      message: 'Checkout successful',
      order,
    };
  }
}
