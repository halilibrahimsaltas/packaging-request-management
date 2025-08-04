"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { useLanguage } from "@/context/LanguageContext";

export const PageLoadingHandler = () => {
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

    // Next.js App Router events
    const handleRouteChange = () => {
      showLoading(t("loading.redirecting"));
    };

    const handleRouteComplete = () => {
      hideLoading();
    };

    // Listen for navigation events
    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, [showLoading, hideLoading, t]);

  return null;
};
