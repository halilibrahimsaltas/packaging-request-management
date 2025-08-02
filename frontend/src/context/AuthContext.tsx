import { createContext, useContext, useState, ReactNode } from "react";
import { UserRole, UserRoleType } from "@/types/role.type";

interface AuthContextType {
  role: UserRoleType;
  login: (role: UserRoleType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRoleType>(null);

  const login = (newRole: UserRoleType) => setRole(newRole);
  const logout = () => setRole(null);

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
