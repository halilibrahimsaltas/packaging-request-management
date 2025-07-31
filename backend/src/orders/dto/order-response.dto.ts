export class OrderItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  productType: string;
  quantity: number;
}

export class OrderResponseDto {
  id: number;
  customerId: number;
  customerName: string;
  items: OrderItemResponseDto[];
  createdAt: Date;
}