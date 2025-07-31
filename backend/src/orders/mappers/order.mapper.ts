import { Order } from '../entities/order.entity';
import { OrderResponseDto } from '../dto/order-response.dto';

export function mapOrderToDto(order: Order): OrderResponseDto {
  return {
    id: order.id,
    customerId: order.customer.id,
    customerName: order.customer.username,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      productType: item.product.type,
      quantity: item.quantity,
    })),
  };
}
