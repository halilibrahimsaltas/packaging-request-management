import { apiRequest } from "./api-client";
import {
  Order,
  ApiResponse,
  PaginationParams,
  CreateSupplierInterestDto,
  UpdateSupplierInterestDto,
} from "@/types/order.types";

// Supplier Interests API
export const supplierInterestsApi = {
  // Create supplier interest
  createInterest: async (
    interestData: CreateSupplierInterestDto
  ): Promise<Record<string, unknown>> => {
    try {
      const response = await apiRequest<ApiResponse<Record<string, unknown>>>(
        "/supplier-interests",
        {
          method: "POST",
          body: JSON.stringify(interestData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("createInterest error:", error);
      throw error;
    }
  },

  // Update supplier interest
  updateInterest: async (
    interestId: number,
    updateData: UpdateSupplierInterestDto
  ): Promise<Record<string, unknown>> => {
    try {
      const response = await apiRequest<ApiResponse<Record<string, unknown>>>(
        `/supplier-interests/${interestId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("updateInterest error:", error);
      throw error;
    }
  },

  // Get supplier's interests
  getMyInterests: async (): Promise<Record<string, unknown>[]> => {
    try {
      const response = await apiRequest<ApiResponse<Record<string, unknown>[]>>(
        "/supplier-interests/my-interests"
      );
      return response.data;
    } catch (error) {
      console.error("getMyInterests error:", error);
      throw error;
    }
  },

  // Get supplier interests for specific supplier
  getSupplierInterests: async (
    supplierId: number
  ): Promise<Record<string, unknown>[]> => {
    try {
      const response = await apiRequest<ApiResponse<Record<string, unknown>[]>>(
        `/supplier-interests/supplier/${supplierId}`
      );
      return response.data;
    } catch (error) {
      console.error("getSupplierInterests error:", error);
      throw error;
    }
  },

  // Supplier: Get orders by product types
  getOrdersByProductTypes: async (
    productTypes: string[],
    params?: PaginationParams
  ): Promise<Order[]> => {
    try {
      const queryParams = new URLSearchParams({
        productTypes: productTypes.join(","),
        ...(params as Record<string, string>),
      }).toString();
      const response = await apiRequest<ApiResponse<Order[]>>(
        `/supplier-interests/orders/by-product-types?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("getOrdersByProductTypes error:", error);
      throw error;
    }
  },

  // Supplier: Get order detail for supplier
  getOrderDetailForSupplier: async (orderId: number): Promise<Order> => {
    try {
      const response = await apiRequest<ApiResponse<Order>>(
        `/supplier-interests/orders/${orderId}/detail`
      );
      return response.data;
    } catch (error) {
      console.error("getOrderDetailForSupplier error:", error);
      throw error;
    }
  },

  // Supplier: Toggle interest status
  toggleInterest: async (
    orderId: number,
    isInterested: boolean,
    notes?: string
  ): Promise<Record<string, unknown>> => {
    try {
      const response = await apiRequest<ApiResponse<Record<string, unknown>>>(
        `/supplier-interests/orders/${orderId}/toggle-interest`,
        {
          method: "POST",
          body: JSON.stringify({ isInterested, notes }),
        }
      );
      return response.data;
    } catch (error) {
      console.error("toggleInterest error:", error);
      throw error;
    }
  },

  // Admin: Get all supplier interests
  getAllSupplierInterests: async (
    params?: PaginationParams
  ): Promise<Record<string, unknown>[]> => {
    try {
      const queryParams = params
        ? new URLSearchParams(params as Record<string, string>).toString()
        : "";
      const url = queryParams
        ? `/supplier-interests?${queryParams}`
        : "/supplier-interests";
      const response = await apiRequest<ApiResponse<Record<string, unknown>[]>>(
        url
      );
      return response.data;
    } catch (error) {
      console.error("getAllSupplierInterests error:", error);
      throw error;
    }
  },

  // Get supplier interests by order
  getSupplierInterestsByOrder: async (
    orderId: number
  ): Promise<Record<string, unknown>[]> => {
    try {
      const response = await apiRequest<ApiResponse<Record<string, unknown>[]>>(
        `/supplier-interests/order/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("getSupplierInterestsByOrder error:", error);
      throw error;
    }
  },

  // Admin: Get supplier interests by supplier
  getSupplierInterestsBySupplier: async (
    supplierId: number
  ): Promise<Record<string, unknown>[]> => {
    try {
      const response = await apiRequest<ApiResponse<Record<string, unknown>[]>>(
        `/supplier-interests/supplier/${supplierId}`
      );
      return response.data;
    } catch (error) {
      console.error("getSupplierInterestsBySupplier error:", error);
      throw error;
    }
  },

  // Admin: Get specific supplier interest
  getSupplierInterest: async (id: number): Promise<Record<string, unknown>> => {
    try {
      const response = await apiRequest<ApiResponse<Record<string, unknown>>>(
        `/supplier-interests/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("getSupplierInterest error:", error);
      throw error;
    }
  },

  // Admin: Delete supplier interest
  deleteSupplierInterest: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await apiRequest<ApiResponse<{ message: string }>>(
        `/supplier-interests/${id}`,
        {
          method: "DELETE",
        }
      );
      return response.data;
    } catch (error) {
      console.error("deleteSupplierInterest error:", error);
      throw error;
    }
  },
};
