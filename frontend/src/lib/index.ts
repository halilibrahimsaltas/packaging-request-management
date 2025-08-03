// API Client ve temel fonksiyonlar
export { apiRequest, ApiError, authApi, apiUtils } from "./api-client";

// API Modülleri
export { productsApi } from "./products-api";
export { ordersApi } from "./orders-api";
export { usersApi } from "./users-api";
export { supplierInterestsApi } from "./supplier-interests-api";

// Mevcut axios tabanlı API (geriye uyumluluk için)
export { default as axiosApi } from "./app";

// Ana API objesi (geriye uyumluluk için)
import { authApi, apiUtils } from "./api-client";
import { productsApi } from "./products-api";
import { ordersApi } from "./orders-api";
import { usersApi } from "./users-api";
import { supplierInterestsApi } from "./supplier-interests-api";

export default {
  products: productsApi,
  orders: ordersApi,
  auth: authApi,
  users: usersApi,
  supplierInterests: supplierInterestsApi,
  utils: apiUtils,
};
