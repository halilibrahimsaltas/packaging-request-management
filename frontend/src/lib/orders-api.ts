import { apiRequest } from "./api-client";
import {
  Order,
  ApiResponse,
  PaginationParams,
  OrderFilterParams,
  CreateOrderDto,
  UpdateOrderDto,
} from "@/types/order.types";

// Orders API
export const ordersApi = {
  // Create new order
  createOrder: async (orderData: CreateOrderDto): Promise<Order> => {
    try {
      const response = await apiRequest<ApiResponse<Order>>("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
      return response.data;
    } catch (error) {
      console.error("createOrder error:", error);
      throw error;
    }
  },

  // Get customer's orders
  getMyOrders: async (params?: PaginationParams): Promise<Order[]> => {
    try {
      const queryParams = params
        ? new URLSearchParams(params as any).toString()
        : "";
      const url = queryParams
        ? `/orders/my-orders?${queryParams}`
        : "/orders/my-orders";
      const response = await apiRequest<ApiResponse<Order[]>>(url);
      return response.data;
    } catch (error) {
      console.error("getMyOrders error:", error);
      throw error;
    }
  },

  // Get customer's order with supplier interests
  getMyOrderWithSuppliers: async (orderId: number): Promise<Order> => {
    try {
      const response = await apiRequest<ApiResponse<Order>>(
        `/orders/my-orders/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("getMyOrderWithSuppliers error:", error);
      throw error;
    }
  },

  // Get orders by product type (for suppliers)
  getOrdersByProductType: async (productType: string): Promise<Order[]> => {
    try {
      const response = await apiRequest<ApiResponse<Order[]>>(
        `/orders/product-type/${productType}`
      );
      return response.data;
    } catch (error) {
      console.error("getOrdersByProductType error:", error);
      throw error;
    }
  },

  // Admin: Get all orders
  getAllOrders: async (params?: OrderFilterParams): Promise<Order[]> => {
    try {
      const queryParams = params
        ? new URLSearchParams(params as any).toString()
        : "";
      const url = queryParams ? `/orders?${queryParams}` : "/orders";
      const response = await apiRequest<ApiResponse<Order[]>>(url);
      return response.data;
    } catch (error) {
      console.error("getAllOrders error:", error);
      throw error;
    }
  },

  // Admin: Get all orders with supplier interests
  getAllOrdersWithSupplierInterests: async (
    params?: PaginationParams
  ): Promise<Order[]> => {
    try {
      const queryParams = params
        ? new URLSearchParams(params as any).toString()
        : "";
      const url = queryParams
        ? `/orders/with-supplier-interests?${queryParams}`
        : "/orders/with-supplier-interests";
      const response = await apiRequest<ApiResponse<Order[]>>(url);
      return response.data;
    } catch (error) {
      console.error("getAllOrdersWithSupplierInterests error:", error);
      throw error;
    }
  },

  // Customer: Delete own order
  deleteMyOrder: async (orderId: number): Promise<{ message: string }> => {
    try {
      const response = await apiRequest<{ message: string }>(
        `/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );
      return response;
    } catch (error) {
      console.error("deleteMyOrder error:", error);
      throw error;
    }
  },

  // Admin: Get specific order with supplier interests
  getOrderWithSupplierInterests: async (id: number): Promise<Order> => {
    try {
      const response = await apiRequest<ApiResponse<Order>>(
        `/orders/with-supplier-interests/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("getOrderWithSupplierInterests error:", error);
      throw error;
    }
  },

  // Admin: Get orders by supplier interest
  getOrdersBySupplierInterest: async (supplierId: number): Promise<Order[]> => {
    try {
      const response = await apiRequest<ApiResponse<Order[]>>(
        `/orders/by-supplier-interest/${supplierId}`
      );
      return response.data;
    } catch (error) {
      console.error("getOrdersBySupplierInterest error:", error);
      throw error;
    }
  },

  // Admin: Get orders by customer
  getOrdersByCustomer: async (customerId: number): Promise<Order[]> => {
    try {
      const response = await apiRequest<ApiResponse<Order[]>>(
        `/orders/customer/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("getOrdersByCustomer error:", error);
      throw error;
    }
  },

  // Admin: Get specific order
  getOrder: async (id: number): Promise<Order> => {
    try {
      const response = await apiRequest<ApiResponse<Order>>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error("getOrder error:", error);
      throw error;
    }
  },

  // Admin: Update order
  updateOrder: async (
    id: number,
    orderData: UpdateOrderDto
  ): Promise<Order> => {
    try {
      const response = await apiRequest<ApiResponse<Order>>(`/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(orderData),
      });
      return response.data;
    } catch (error) {
      console.error("updateOrder error:", error);
      throw error;
    }
  },

  // Admin: Delete order
  deleteOrder: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await apiRequest<ApiResponse<{ message: string }>>(
        `/orders/${id}`,
        {
          method: "DELETE",
        }
      );
      return response.data;
    } catch (error) {
      console.error("deleteOrder error:", error);
      throw error;
    }
  },
};
