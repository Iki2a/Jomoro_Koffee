import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Kopi Susu Gula Aren' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Kopi susu premium dengan gula aren asli dari Banten' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ example: 'https://example.com/kopi.jpg', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}
