import { apiRequest } from "./api-client";

// SWR için fetcher fonksiyonu
export const fetcher = async (url: string) => {
  try {
    const response = await apiRequest(url);
    return response;
  } catch (error) {
    console.error("Fetcher error:", error);
    throw error;
  }
};

// SWR için key-based fetcher
export const keyFetcher = async (key: string | string[]) => {
  if (typeof key === "string") {
    return fetcher(key);
  }

  // Array key için (örn: ["/products", { type: "box" }])
  const [url, params] = key;
  if (url && params) {
    const queryParams = new URLSearchParams(params as any).toString();
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;
    return fetcher(fullUrl);
  }

  if (url) {
    return fetcher(url);
  }

  throw new Error("Invalid key format");
};

// Conditional fetcher (sadece authenticated kullanıcılar için)
export const authFetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  return fetcher(url);
};
