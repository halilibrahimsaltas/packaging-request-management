"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    router.replace("/admin/users");
  }, [router]);

  return (
    <AuthGuard requiredRole={UserRole.ADMIN}>
      <div>{t("common.redirecting")}</div>
    </AuthGuard>
  );
}
