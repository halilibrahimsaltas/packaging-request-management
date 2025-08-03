// Redesigned Sidebar inspired by the login page's gradient theme and structure

"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Logout,
  Settings,
  Dashboard,
  People,
  Assignment,
  Inventory,
  Add,
  FilterList,
  CheckCircle,
  Business,
  Factory,
  Person,
  ShoppingCart,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { UserRole } from "@/types/role.type";

const drawerWidth = 280;

interface SidebarProps {
  open?: boolean;
  onToggle?: () => void;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  href: string;
  badge?: number;
}

export default function Sidebar({ open = true, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { getTotalItems } = useCart();
  const router = useRouter();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const roleInfo = {
    [UserRole.ADMIN]: {
      icon: <Business />,
      text: "Yönetici",
      color: "error" as const,
    },
    [UserRole.SUPPLIER]: {
      icon: <Factory />,
      text: "Tedarikçi",
      color: "warning" as const,
    },
    [UserRole.CUSTOMER]: {
      icon: <Person />,
      text: "Müşteri",
      color: "primary" as const,
    },
  };

  const menuItems: Record<UserRole, MenuItem[]> = {
    [UserRole.ADMIN]: [
      {
        text: t("dashboard.admin.userManagement"),
        icon: <People />,
        href: "/admin/users",
      },
      {
        text: t("dashboard.admin.requestManagement"),
        icon: <Assignment />,
        href: "/admin/requests",
      },
      {
        text: t("dashboard.admin.productCatalog"),
        icon: <Inventory />,
        href: "/admin/products",
      },
    ],
    [UserRole.CUSTOMER]: [
      {
        text: t("dashboard.customer.productCatalog"),
        icon: <Inventory />,
        href: "/customer/products",
      },
      {
        text: t("dashboard.customer.cart"),
        icon: <ShoppingCart />,
        href: "/customer/orders",
        badge: getTotalItems(),
      },
      {
        text: t("dashboard.customer.createRequest"),
        icon: <Add />,
        href: "/customer/products",
      },
      {
        text: t("dashboard.customer.myRequests"),
        icon: <Assignment />,
        href: "/customer/request",
      },
    ],
    [UserRole.SUPPLIER]: [
      {
        text: t("dashboard.supplier.viewRequests"),
        icon: <Assignment />,
        href: "/supplier/requests",
      },
      {
        text: t("dashboard.supplier.filter"),
        icon: <FilterList />,
        href: "/supplier/filter",
      },
      {
        text: t("dashboard.supplier.interested"),
        icon: <CheckCircle />,
        href: "/supplier/interested",
      },
    ],
  };

  const currentMenuItems = user?.role ? menuItems[user.role as UserRole] : [];
  const currentRoleInfo = user?.role ? roleInfo[user.role as UserRole] : null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: "#1f1f2e",
          color: "white",
          borderRight: "none",
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight={700} color="white">
            {t("app.title")}
          </Typography>
        </Box>

        <Typography
          variant="overline"
          color="rgba(255,255,255,0.6)"
          gutterBottom
        >
          {t("common.menu")}
        </Typography>
        <List>
          {currentMenuItems.map((item, i) => (
            <ListItem key={i} disablePadding>
              <ListItemButton
                onClick={() => router.push(item.href)}
                sx={{ borderRadius: 1, mb: 1, color: "white" }}
              >
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.badge && item.badge > 0 && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      backgroundColor: "#667eea",
                      color: "white",
                      fontSize: "0.75rem",
                      height: "20px",
                      minWidth: "20px",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

        <Typography
          variant="overline"
          color="rgba(255,255,255,0.6)"
          gutterBottom
        >
          {t("common.user")}
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ color: "#f44336" }}>
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary={t("common.logout")}
                sx={{ color: "#f44336" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
