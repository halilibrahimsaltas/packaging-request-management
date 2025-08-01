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

export function mapMaskedSupplierInterestToDto(supplierInterest: any): SupplierInterestResponseDto {
  return {
    id: supplierInterest.id,
    supplierId: supplierInterest.supplierId,
    supplierName: supplierInterest.supplierName, // already masked
    isInterested: supplierInterest.isInterested,
    notes: supplierInterest.notes,
    createdAt: supplierInterest.createdAt,
    updatedAt: supplierInterest.updatedAt,
  };
}

export function mapOrderWithSupplierInterestsToDto(orderWithInterests: any): OrderWithSupplierInterestsResponseDto {
  const baseOrder = mapOrderToDto(orderWithInterests);
  
  // if supplier names are already masked, use them
  const supplierInterests = orderWithInterests.supplierInterests?.map((si: any) => {
    if (si.supplierName && si.supplierName.includes('*')) {
      // already masked
      return mapMaskedSupplierInterestToDto(si);
    } else {
      // Normal mapping
      return mapSupplierInterestToDto(si);
    }
  }) || [];
  
  return {
    ...baseOrder,
    supplierInterests,
    interestedSuppliersCount: orderWithInterests.interestedSuppliersCount || 0,
    totalSuppliersCount: orderWithInterests.totalSuppliersCount || 0,
  };
}
