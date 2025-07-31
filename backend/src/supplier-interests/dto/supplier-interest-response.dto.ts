import { Order } from '../../orders/entities/order.entity';

export class SupplierInterestResponseDto {
  id: number;
  supplier: {
    id: number;
    username: string; 
    maskedName: string; // masked name
  };
  order: Order;
  isInterested: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 