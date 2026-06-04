import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
