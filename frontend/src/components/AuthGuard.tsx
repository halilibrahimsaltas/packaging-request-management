"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/role.type";
import { AuthGuardProps } from "@/types/auth.types";

export const AuthGuard = ({
  children,
  requiredRole,
  redirectTo = "/auth/login",
}: AuthGuardProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        switch (user?.role) {
          case UserRole.ADMIN:
            router.push("/admin");
            break;
          case UserRole.CUSTOMER:
            router.push("/customer");
            break;
          case UserRole.SUPPLIER:
            router.push("/supplier");
            break;
          default:
            router.push("/");
        }
        return;
      }
    }
  }, [isAuthenticated, loading, user, requiredRole, router, redirectTo]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};
