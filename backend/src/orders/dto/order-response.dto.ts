export class OrderItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  productType: string;
  quantity: number;
}

export class SupplierInterestResponseDto {
  id: number;
  supplierId: number;
  supplierName: string;
  isInterested: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderResponseDto {
  id: number;
  customerId: number;
  customerName: string;
  items: OrderItemResponseDto[];
  createdAt: Date;
}

export class OrderWithSupplierInterestsResponseDto extends OrderResponseDto {
  supplierInterests: SupplierInterestResponseDto[];
  interestedSuppliersCount: number;
  totalSuppliersCount: number;
}
