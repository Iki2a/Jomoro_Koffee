import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all user orders' })
  async getOrders(@Request() req) {
    return this.ordersService.getOrders(req.user.id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Get order detail with product data' })
  async getOrderDetail(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.getOrderDetail(req.user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Checkout - Create order from cart' })
  async checkout(@Request() req) {
    return this.ordersService.checkout(req.user.id);
  }
}
