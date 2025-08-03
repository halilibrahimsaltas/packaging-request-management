"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/users");
  }, [router]);

  return (
    <AuthGuard requiredRole={UserRole.ADMIN}>
      <div>Yönlendiriliyor...</div>
    </AuthGuard>
  );
}
