import { IsNumber, IsPositive, Min } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
} 