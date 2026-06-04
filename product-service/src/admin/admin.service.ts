import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    // Validate product name: min 3 words (no RegEx)
    const words = dto.name
      .trim()
      .split(' ')
      .filter((w) => w.length > 0);
    if (words.length < 3) {
      throw new BadRequestException('Product name must contain at least 3 words');
    }

    // Validate description: min 20 characters
    if (!dto.description || dto.description.length < 20) {
      throw new BadRequestException(
        'Product description must be at least 20 characters',
      );
    }

    // Validate price: positive integer >= 1
    if (!Number.isInteger(dto.price) || dto.price < 1) {
      throw new BadRequestException('Price must be a positive integer (>= 1)');
    }

    // Validate stock: 0-999
    if (!Number.isInteger(dto.stock) || dto.stock < 0 || dto.stock > 999) {
      throw new BadRequestException('Stock must be between 0 and 999');
    }

    // Validate category_id exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.category_id },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.image_url || null,
        category_id: dto.category_id,
      },
      include: { category: true },
    });
  }

  async updateProduct(id: number, dto: CreateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Same validation as create
    const words = dto.name
      .trim()
      .split(' ')
      .filter((w) => w.length > 0);
    if (words.length < 3) {
      throw new BadRequestException('Product name must contain at least 3 words');
    }

    if (!dto.description || dto.description.length < 20) {
      throw new BadRequestException(
        'Product description must be at least 20 characters',
      );
    }

    if (!Number.isInteger(dto.price) || dto.price < 1) {
      throw new BadRequestException('Price must be a positive integer (>= 1)');
    }

    if (!Number.isInteger(dto.stock) || dto.stock < 0 || dto.stock > 999) {
      throw new BadRequestException('Stock must be between 0 and 999');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.category_id },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.image_url || null,
        category_id: dto.category_id,
      },
      include: { category: true },
    });
  }

  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({ where: { id } });

    return { message: 'Product deleted successfully' };
  }
}
