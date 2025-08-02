import { SupplierInterest } from '../entities/supplier-interest.entity';

export class SupplierInterestMapper {
  /**
   * Masks supplier name (Ah*** Yı*** format)
   */
  static maskSupplierName(username: string): string {
    if (!username || username.length < 2) return username;
    
    // Masked name logic
    const parts = username.split(' ');
    if (parts.length >= 2) {
      const firstName = parts[0];
      const lastName = parts[parts.length - 1];
      
      const maskedFirstName = firstName.length > 2 
        ? firstName.substring(0, 2) + '***' 
        : firstName + '***';
      
      const maskedLastName = lastName.length > 2 
        ? lastName.substring(0, 2) + '***' 
        : lastName + '***';
      
      return `${maskedFirstName} ${maskedLastName}`;
    }
    
    return username.length > 2 
      ? username.substring(0, 2) + '***' 
      : username + '***';
  }

  /**
   * Maps SupplierInterest entity to response DTO
   */
  static toResponse(interest: SupplierInterest) {
    return {
      id: interest.id,
      supplier: {
        id: interest.supplier.id,
        username: interest.supplier.username,
        maskedName: this.maskSupplierName(interest.supplier.username),
      },
      order: {
        id: interest.order.id,
        customer: {
          id: interest.order.customer.id,
          username: interest.order.customer.username,
        },
        items: interest.order.items.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            type: item.product.type,
          },
          quantity: item.quantity,
        })),
        createdAt: interest.order.createdAt,
      },
      isInterested: interest.isInterested,
      notes: interest.notes,
      createdAt: interest.createdAt,
      updatedAt: interest.updatedAt,
    };
  }

  /**
   * Maps array of SupplierInterest entities to response DTOs
   */
  static toResponseArray(interests: SupplierInterest[]) {
    return interests.map(interest => this.toResponse(interest));
  }
}
