import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { ProductsService } from '../products/products.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':categoryId/products')
  @ApiOperation({ summary: 'List products by category' })
  async findProductsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.findByCategory(categoryId);
  }
}
