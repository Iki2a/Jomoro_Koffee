import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
