// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Generic API Response
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// API Error Response
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// HTTP Methods
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Request Options
export interface RequestOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: string | FormData | URLSearchParams;
  signal?: AbortSignal;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
