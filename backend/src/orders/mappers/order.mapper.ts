import { Order } from '../entities/order.entity';
import { OrderResponseDto, OrderWithSupplierInterestsResponseDto, SupplierInterestResponseDto } from '../dto/order-response.dto';

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

export function mapSupplierInterestToDto(supplierInterest: any): SupplierInterestResponseDto {
  return {
    id: supplierInterest.id,
    supplierId: supplierInterest.supplier.id,
    supplierName: supplierInterest.supplier.username,
    isInterested: supplierInterest.isInterested,
    notes: supplierInterest.notes,
    createdAt: supplierInterest.createdAt,
    updatedAt: supplierInterest.updatedAt,
  };
}

export function mapOrderWithSupplierInterestsToDto(orderWithInterests: any): OrderWithSupplierInterestsResponseDto {
  const baseOrder = mapOrderToDto(orderWithInterests);
  
  return {
    ...baseOrder,
    supplierInterests: orderWithInterests.supplierInterests?.map(mapSupplierInterestToDto) || [],
    interestedSuppliersCount: orderWithInterests.interestedSuppliersCount || 0,
    totalSuppliersCount: orderWithInterests.totalSuppliersCount || 0,
  };
}
