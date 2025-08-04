import {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse,
  User,
} from "@/types/order.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Error handling
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// HTTP client utility
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`API Request: ${url}`);

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, config);
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);

      // Handle 401 Unauthorized errors
      if (response.status === 401) {
        // Try to refresh token
        const refreshSuccess = await apiUtils.refreshTokenIfNeeded();
        if (refreshSuccess) {
          // Retry the request with new token
          const newToken = localStorage.getItem("accessToken");
          if (newToken) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(url, config);
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              console.log(`API Response (after refresh):`, retryData);
              return retryData;
            }
          }
        }

        // If refresh failed or retry failed, clear auth and throw error
        apiUtils.logout();
        throw new ApiError(
          response.status,
          `Authentication failed: ${errorText}`
        );
      }

      throw new ApiError(
        response.status,
        `HTTP error! status: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`API Response:`, data);
    return data;
  } catch (error) {
    console.error(`Network Error:`, error);
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new ApiError(500, `Network error occurred: ${errorMessage}`);
  }
}

// Auth API
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<ApiResponse<AuthResponse>>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(credentials),
        }
      );
      return response.data;
    } catch (error) {
      console.error("login error:", error);
      throw error;
    }
  },

  // Register
  register: async (userData: RegisterData): Promise<{ user: User }> => {
    try {
      const response = await apiRequest<ApiResponse<{ user: User }>>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("register error:", error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await apiRequest<ApiResponse<RefreshTokenResponse>>(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        }
      );
      return response.data;
    } catch (error) {
      console.error("refreshToken error:", error);
      throw error;
    }
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiRequest<ApiResponse<User>>("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("getProfile error:", error);
      throw error;
    }
  },
};

// Utility functions
export const apiUtils = {
  // Handle token refresh
  refreshTokenIfNeeded: async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    try {
      const response = await authApi.refreshToken(refreshToken);
      localStorage.setItem("accessToken", response.access_token);
      return true;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
