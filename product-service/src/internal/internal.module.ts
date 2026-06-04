import { Module } from '@nestjs/common';
import { InternalController } from './internal.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [InternalController],
})
export class InternalModule {}
