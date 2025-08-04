"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import {
  Notifications,
  Logout,
  Person,
  Settings,
  Business,
  Factory,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { UserRole } from "@/types/role.type";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    router.push("/auth/login");
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return <Business />;
      case UserRole.SUPPLIER:
        return <Factory />;
      case UserRole.CUSTOMER:
        return <Person />;
      default:
        return <Person />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return "error";
      case UserRole.SUPPLIER:
        return "warning";
      case UserRole.CUSTOMER:
        return "primary";
      default:
        return "default";
    }
  };

  const getRoleText = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return t("components.header.role.admin");
      case UserRole.SUPPLIER:
        return t("components.header.role.supplier");
      case UserRole.CUSTOMER:
        return t("components.header.role.customer");
      default:
        return t("components.header.role.user");
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        marginLeft: "280px",
        width: "calc(100% - 280px)",
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* left side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "white",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontWeight: 500,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* language switcher */}
          <LanguageSwitcher />

          {/* user info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              p: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            onClick={handleMenuOpen}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {user?.username}
              </Typography>
              <Chip
                icon={getRoleIcon()}
                label={getRoleText()}
                size="small"
                color={getRoleColor() as any}
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  "& .MuiChip-icon": {
                    fontSize: "0.8rem",
                  },
                }}
              />
            </Box>
          </Box>

          {/* user menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                borderRadius: 2,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push("/profile");
              }}
            >
              <Person sx={{ mr: 2, fontSize: 20 }} />
              {t("common.profile")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push("/settings");
              }}
            >
              <Settings sx={{ mr: 2, fontSize: 20 }} />
              {t("common.settings")}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <Logout sx={{ mr: 2, fontSize: 20 }} />
              {t("common.logout")}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
