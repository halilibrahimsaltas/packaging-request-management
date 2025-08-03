import { apiRequest } from "./api-client";
import {
  User,
  ApiResponse,
  UserFilterParams,
  CreateUserDto,
  UpdateUserDto,
} from "@/types/order.types";

// Users API (Admin)
export const usersApi = {
  // Admin: Get all users
  getAllUsers: async (params?: UserFilterParams): Promise<User[]> => {
    try {
      const queryParams = params
        ? new URLSearchParams(params as any).toString()
        : "";
      const url = queryParams ? `/users?${queryParams}` : "/users";
      const response = await apiRequest<ApiResponse<User[]>>(url);
      return response.data;
    } catch (error) {
      console.error("getAllUsers error:", error);
      throw error;
    }
  },

  // Admin: Get user by ID
  getUser: async (id: number): Promise<User> => {
    try {
      const response = await apiRequest<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("getUser error:", error);
      throw error;
    }
  },

  // Admin: Create user
  createUser: async (userData: CreateUserDto): Promise<User> => {
    try {
      const response = await apiRequest<ApiResponse<User>>("/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response.data;
    } catch (error) {
      console.error("createUser error:", error);
      throw error;
    }
  },

  // Admin: Update user
  updateUser: async (id: number, userData: UpdateUserDto): Promise<User> => {
    try {
      const response = await apiRequest<ApiResponse<User>>(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(userData),
      });
      return response.data;
    } catch (error) {
      console.error("updateUser error:", error);
      throw error;
    }
  },

  // Admin: Delete user
  deleteUser: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await apiRequest<ApiResponse<{ message: string }>>(
        `/users/${id}`,
        {
          method: "DELETE",
        }
      );
      return response.data;
    } catch (error) {
      console.error("deleteUser error:", error);
      throw error;
    }
  },
};
