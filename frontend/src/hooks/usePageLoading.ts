"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { useLanguage } from "@/context/LanguageContext";

export const usePageLoading = () => {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const { t } = useLanguage();

  useEffect(() => {
    const handleStart = () => {
      showLoading(t("loading.redirecting"));
    };

    const handleComplete = () => {
      hideLoading();
    };

    // Next.js router events
    router.events?.on("routeChangeStart", handleStart);
    router.events?.on("routeChangeComplete", handleComplete);
    router.events?.on("routeChangeError", handleComplete);

    return () => {
      router.events?.off("routeChangeStart", handleStart);
      router.events?.off("routeChangeComplete", handleComplete);
      router.events?.off("routeChangeError", handleComplete);
    };
  }, [router, showLoading, hideLoading, t]);

  return { showLoading, hideLoading };
}; 