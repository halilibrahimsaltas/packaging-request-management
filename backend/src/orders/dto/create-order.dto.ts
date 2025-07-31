import { IsArray, IsNotEmpty, ValidateNested, ArrayMinSize, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must have at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
