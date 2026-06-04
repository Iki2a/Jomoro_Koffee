import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin - Products')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productsService: ProductsService,
  ) {}

  @Post('products')
  @ApiOperation({ summary: 'Create a new product (ADMIN only)' })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Post('products/:id/update')
  @ApiOperation({ summary: 'Update a product (ADMIN only)' })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductDto,
  ) {
    return this.adminService.updateProduct(id, dto);
  }

  @Post('products/:id/reduce')
  @ApiOperation({ summary: 'Reduce product stock (ADMIN only)' })
  async reduceStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReduceStockDto,
  ) {
    return this.productsService.reduceStock(id, dto.quantity);
  }

  @Post('products/:id/delete')
  @ApiOperation({ summary: 'Delete a product (ADMIN only)' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }
}
