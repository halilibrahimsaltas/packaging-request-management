// Redesigned Sidebar to match the header's purple gradient theme

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
  useMediaQuery,
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
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const roleInfo = {
    [UserRole.ADMIN]: {
      icon: <Business />,
      text: t("components.sidebar.role.admin"),
      color: "#ff6b6b",
    },
    [UserRole.SUPPLIER]: {
      icon: <Factory />,
      text: t("components.sidebar.role.supplier"),
      color: "#4ecdc4",
    },
    [UserRole.CUSTOMER]: {
      icon: <Person />,
      text: t("components.sidebar.role.customer"),
      color: "#45b7d1",
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
        text: t("dashboard.customer.productCatalog"),
        icon: <Inventory />,
        href: "/supplier/products",
      },
      {
        text: t("dashboard.supplier.viewRequests"),
        icon: <Assignment />,
        href: "/supplier/requests",
      },
      {
        text: t("dashboard.supplier.interested"),
        icon: <CheckCircle />,
        href: "/supplier/supplier-interests",
      },
    ],
  };

  const currentMenuItems = user?.role ? menuItems[user.role as UserRole] : [];
  const currentRoleInfo = user?.role ? roleInfo[user.role as UserRole] : null;

  const handleMenuItemClick = (href: string) => {
    router.push(href);
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={isMobile ? onToggle : undefined}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "block", md: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRight: "none",
          boxSizing: "border-box",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
          zIndex: isMobile ? 1200 : 1100,
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Logo Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={700}
            color="white"
            sx={{
              background: "linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontSize: {
                xs: "1.1rem",
                sm: "1.25rem",
                md: "1.5rem",
              },
            }}
          >
            {t("app.title")}
          </Typography>
          {isMobile && (
            <IconButton
              onClick={onToggle}
              sx={{
                color: "white",
                p: 0.5,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* User Role Badge */}
        {currentRoleInfo && (
          <Box
            sx={{
              mb: 3,
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  p: { xs: 0.5, sm: 1 },
                  borderRadius: 1,
                  backgroundColor: currentRoleInfo.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {currentRoleInfo.icon}
              </Box>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.875rem",
                  },
                }}
              >
                {currentRoleInfo.text}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Menu Section */}
        <Typography
          variant="overline"
          sx={{
            color: "rgba(255,255,255,0.8)",
            fontWeight: 600,
            letterSpacing: 1,
            mb: 2,
            display: "block",
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
            },
          }}
        >
          {t("common.menu")}
        </Typography>

        <List sx={{ mb: 3 }}>
          {currentMenuItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleMenuItemClick(item.href)}
                  sx={{
                    borderRadius: 2,
                    color: "white",
                    background: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.3)"
                      : "1px solid transparent",
                    "&:hover": {
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transform: "translateX(4px)",
                    },
                    transition: "all 0.3s ease",
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 1.5, sm: 2 },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "white" : "rgba(255,255,255,0.8)",
                      minWidth: { xs: 36, sm: 40 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: isActive ? 600 : 500,
                        fontSize: {
                          xs: "0.8rem",
                          sm: "0.9rem",
                        },
                      },
                    }}
                  />
                  {item.badge && item.badge > 0 && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        backgroundColor: "#ff6b6b",
                        color: "white",
                        fontSize: "0.75rem",
                        height: "20px",
                        minWidth: "20px",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider
          sx={{
            my: 3,
            borderColor: "rgba(255,255,255,0.2)",
            opacity: 0.6,
          }}
        />

        {/* User Section */}
        <Typography
          variant="overline"
          sx={{
            color: "rgba(255,255,255,0.8)",
            fontWeight: 600,
            letterSpacing: 1,
            mb: 2,
            display: "block",
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
            },
          }}
        >
          {t("common.user")}
        </Typography>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: "#ff6b6b",
                border: "1px solid rgba(255,107,107,0.3)",
                "&:hover": {
                  background: "rgba(255,107,107,0.1)",
                  border: "1px solid rgba(255,107,107,0.5)",
                  transform: "translateX(4px)",
                },
                transition: "all 0.3s ease",
                py: { xs: 1, sm: 1.5 },
                px: { xs: 1.5, sm: 2 },
              }}
            >
              <ListItemIcon
                sx={{ color: "#ff6b6b", minWidth: { xs: 36, sm: 40 } }}
              >
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary={t("common.logout")}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.9rem",
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
