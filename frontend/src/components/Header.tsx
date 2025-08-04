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
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Notifications,
  Logout,
  Person,
  Settings,
  Business,
  Factory,
  Menu as MenuIcon,
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
  onMenuToggle?: () => void;
}

export default function Header({ title, subtitle, onMenuToggle }: HeaderProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginLeft: {
            xs: 0,
            md: "280px",
          },
          width: {
            xs: "100%",
            md: "calc(100% - 280px)",
          },
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          {/* left side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMobileMenuToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.25rem",
                    md: "1.5rem",
                  },
                }}
              >
                {title}
              </Typography>
              {subtitle && !isMobile && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 500,
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.875rem",
                    },
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {/* right side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* language switcher */}
            <LanguageSwitcher />

            {/* user info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                p: { xs: 0.5, sm: 1 },
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
              onClick={handleMenuOpen}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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
                  minWidth: { xs: 180, sm: 200 },
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

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 3,
              textAlign: "center",
            }}
          >
            {t("app.title")}
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              <Box>
                <Typography variant="body2" fontWeight={600} color="white">
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
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
              </Box>
            </Box>
          </Box>

          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/profile");
                }}
                sx={{
                  borderRadius: 2,
                  color: "white",
                  mb: 1,
                  "&:hover": {
                    background: "rgba(255,255,255,0.15)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  <Person />
                </ListItemIcon>
                <ListItemText primary={t("common.profile")} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/settings");
                }}
                sx={{
                  borderRadius: 2,
                  color: "white",
                  mb: 1,
                  "&:hover": {
                    background: "rgba(255,255,255,0.15)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary={t("common.settings")} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                sx={{
                  borderRadius: 2,
                  color: "#ff6b6b",
                  border: "1px solid rgba(255,107,107,0.3)",
                  "&:hover": {
                    background: "rgba(255,107,107,0.1)",
                    border: "1px solid rgba(255,107,107,0.5)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#ff6b6b", minWidth: 40 }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary={t("common.logout")} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
