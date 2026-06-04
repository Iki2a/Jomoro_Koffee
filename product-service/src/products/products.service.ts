import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: { category_id: categoryId },
      include: { category: true },
    });
  }

  async reduceStock(id: number, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Requested quantity (${quantity}) exceeds current stock (${product.stock})`,
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: product.stock - quantity },
    });
  }
}
