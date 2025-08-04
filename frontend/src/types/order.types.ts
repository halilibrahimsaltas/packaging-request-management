export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productType: string;
  quantity: number;
}

export interface SupplierInterest {
  id: number;
  orderId: number;
  supplierId: number;
  supplierName: string;
  isInterested: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Backend response interfaces
export interface BackendSupplierInterestResponse {
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
    createdAt: string;
  };
  isInterested: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendOrderDetailResponse {
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
  createdAt: string;
  supplierInterest: {
    id: number;
    isInterested: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  createdAt: string;
  items: OrderItem[];
  supplierInterests: SupplierInterest[];
  interestedSuppliersCount: number;
  totalSuppliersCount: number;
}

export interface CartItem {
  productId: number;
  name: string;
  type: string;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

// Filter Types
export interface ProductFilterParams extends PaginationParams {
  name?: string;
  type?: string;
  isActive?: boolean;
}

export interface OrderFilterParams extends PaginationParams {
  customerId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserFilterParams extends PaginationParams {
  username?: string;
  email?: string;
  role?: string;
}

// DTO Types
export interface CreateProductDto {
  name: string;
  type: string;
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  type?: string;
  isActive?: boolean;
}

export interface CreateOrderDto {
  customerId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface UpdateOrderDto {
  items?: {
    productId: number;
    quantity: number;
  }[];
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: string;
  address?: string;
  phone?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  address?: string;
  phone?: string;
}

export interface CreateSupplierInterestDto {
  orderId: number;
  supplierId: number;
  isInterested: boolean;
  notes?: string;
}

export interface UpdateSupplierInterestDto {
  isInterested?: boolean;
  notes?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
  address?: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
}

// API Response Type
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}
