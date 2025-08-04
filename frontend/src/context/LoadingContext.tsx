"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
  loadingMessage: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Yükleniyor...");

  const showLoading = (message?: string) => {
    setLoadingMessage(message || "Yükleniyor...");
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const value: LoadingContextType = {
    showLoading,
    hideLoading,
    isLoading,
    loadingMessage,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <LoadingSpinner 
          fullScreen 
          message={loadingMessage}
        />
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}; 