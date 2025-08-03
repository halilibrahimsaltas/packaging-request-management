import { apiRequest } from "./api-client";
import {
  Product,
  ApiResponse,
  ProductFilterParams,
  CreateProductDto,
  UpdateProductDto,
} from "@/types/order.types";

// Products API
export const productsApi = {
  // Get all active products (for customers)
  getActiveProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiRequest<ApiResponse<Product[]>>(
        "/products/active"
      );
      return response.data;
    } catch (error) {
      console.error("getActiveProducts error:", error);
      throw error;
    }
  },

  // Get products by type
  getProductsByType: async (type: string): Promise<Product[]> => {
    try {
      const response = await apiRequest<ApiResponse<Product[]>>(
        `/products/type/${type}`
      );
      return response.data;
    } catch (error) {
      console.error("getProductsByType error:", error);
      throw error;
    }
  },

  // Get active product types - backend Product[] döndürüyor, frontend'de string[]'e çeviriyoruz
  getActiveProductTypes: async (): Promise<string[]> => {
    try {
      const response = await apiRequest<ApiResponse<Product[]>>(
        "/products/types/active"
      );
      // Backend Product[] döndürüyor, biz sadece type'ları alıyoruz
      const uniqueTypes = [
        ...new Set(response.data.map((product: Product) => product.type)),
      ];
      return uniqueTypes;
    } catch (error) {
      console.error("getActiveProductTypes error:", error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await apiRequest<ApiResponse<Product>>(
        `/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("getProduct error:", error);
      throw error;
    }
  },

  // Admin: Get all products
  getAllProducts: async (params?: ProductFilterParams): Promise<Product[]> => {
    try {
      const queryParams = params
        ? new URLSearchParams(params as any).toString()
        : "";
      const url = queryParams ? `/products?${queryParams}` : "/products";
      const response = await apiRequest<ApiResponse<Product[]>>(url);
      return response.data;
    } catch (error) {
      console.error("getAllProducts error:", error);
      throw error;
    }
  },

  // Admin: Create product
  createProduct: async (productData: CreateProductDto): Promise<Product> => {
    try {
      const response = await apiRequest<ApiResponse<Product>>("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
      return response.data;
    } catch (error) {
      console.error("createProduct error:", error);
      throw error;
    }
  },

  // Admin: Update product
  updateProduct: async (
    id: number,
    productData: UpdateProductDto
  ): Promise<Product> => {
    try {
      const response = await apiRequest<ApiResponse<Product>>(
        `/products/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(productData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("updateProduct error:", error);
      throw error;
    }
  },

  // Admin: Toggle product active status
  toggleProductActive: async (id: number): Promise<Product> => {
    try {
      const response = await apiRequest<ApiResponse<Product>>(
        `/products/${id}/toggle`,
        {
          method: "PATCH",
        }
      );
      return response.data;
    } catch (error) {
      console.error("toggleProductActive error:", error);
      throw error;
    }
  },

  // Admin: Delete product
  deleteProduct: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await apiRequest<ApiResponse<{ message: string }>>(
        `/products/${id}`,
        {
          method: "DELETE",
        }
      );
      return response.data;
    } catch (error) {
      console.error("deleteProduct error:", error);
      throw error;
    }
  },

  // Admin: Get product types
  getProductTypes: async (): Promise<string[]> => {
    try {
      const response = await apiRequest<ApiResponse<string[]>>(
        "/products/types"
      );
      return response.data;
    } catch (error) {
      console.error("getProductTypes error:", error);
      throw error;
    }
  },
};
