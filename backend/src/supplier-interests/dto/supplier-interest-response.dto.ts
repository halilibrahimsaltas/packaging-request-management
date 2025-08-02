import { Order } from '../../orders/entities/order.entity';

export class SupplierInterestResponseDto {
  id: number;
  supplier: {
    id: number;
    username: string;
    maskedName: string;
  };
  order: {
    id: number;
    customer: {
      id: number;
      username: string;
    };
    items: Array<{
      id: number;
      product: {
        id: number;
        name: string;
        type: string;
      };
      quantity: number;
    }>;
    createdAt: Date;
  };
  isInterested: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 