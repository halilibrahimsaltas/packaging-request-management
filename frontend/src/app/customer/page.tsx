"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      router.push("/customer/products");
    }
  }, [router, user]);

  return (
    <AuthGuard requiredRole={UserRole.CUSTOMER}>
      <div>{t("common.redirecting")}</div>
    </AuthGuard>
  );
}
