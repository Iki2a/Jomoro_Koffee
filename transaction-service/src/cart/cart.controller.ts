import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart with product details' })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Post(':product_id/update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @Request() req,
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, productId, dto);
  }

  @Post(':product_id/delete')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeCartItem(
    @Request() req,
    @Param('product_id', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeCartItem(req.user.id, productId);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear all items in cart' })
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
