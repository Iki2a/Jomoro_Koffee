import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from '../products/products.service';

@ApiTags('Internal')
@Controller('internal')
export class InternalController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('products/:id/reduce-stock')
  @ApiOperation({ summary: 'Reduce product stock (internal - service-to-service)' })
  async reduceStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.reduceStock(id, quantity);
  }
}
