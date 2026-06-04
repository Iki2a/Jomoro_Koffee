import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
