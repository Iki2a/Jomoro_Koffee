import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ReduceStockDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
