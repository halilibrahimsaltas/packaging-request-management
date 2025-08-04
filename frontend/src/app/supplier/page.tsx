"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Assignment,
  CheckCircle,
  Inventory,
  TrendingUp,
  Visibility,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { supplierInterestsApi } from "@/lib";

export default function SupplierDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showError } = useToast();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterests: 0,
    activeInterests: 0,
    totalRequests: 0,
    availableProducts: 0,
  });

  // Load dashboard stats from backend
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        console.log("Loading supplier dashboard stats...");

        // Get supplier interests
        const interests = await supplierInterestsApi.getMyInterests();
        const activeInterests = interests.filter(
          (interest: any) => interest.isInterested
        );

        // Get available requests (orders)
        const requests = await supplierInterestsApi.getOrdersByProductTypes([]);

        setStats({
          totalInterests: interests.length,
          activeInterests: activeInterests.length,
          totalRequests: requests.length,
          availableProducts: 0, // This would need a separate API call
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        showError(t("supplier.dashboard.error.load"));
        setStats({
          totalInterests: 0,
          activeInterests: 0,
          totalRequests: 0,
          availableProducts: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [showError, t]);

  const handleNavigateTo = (path: string) => {
    router.push(path);
  };

  const StatCard = ({ title, value, icon, color, onClick }: any) => (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: 4,
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              color={color}
              gutterBottom
            >
              {loading ? <Skeleton width={60} height={40} /> : value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Responsive sidebar width
  const getSidebarWidth = () => {
    if (isSmallScreen) return "200px";
    if (isTablet) return "240px";
    return "280px";
  };

  return (
    <AuthGuard requiredRole={UserRole.SUPPLIER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title={t("supplier.dashboard.title")} />

        {/* Main Content */}
        <Box
          sx={{
            py: 2,
            px: 3,
            marginLeft: {
              xs: 0,
              md: getSidebarWidth(),
            },
            width: {
              xs: "100%",
              md: `calc(100% - ${getSidebarWidth()})`,
            },
            minHeight: "100vh",
          }}
        >
          {/* Welcome Section */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t("supplier.dashboard.welcome", { username: user?.username })}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("supplier.dashboard.subtitle")}
              </Typography>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(auto-fit, minmax(250px, 1fr))",
              },
              gap: 3,
              mb: 3,
            }}
          >
            <StatCard
              title={t("supplier.dashboard.stats.totalInterests")}
              value={stats.totalInterests}
              icon={<Assignment sx={{ color: "#667eea" }} />}
              color="#667eea"
              onClick={() => handleNavigateTo("/supplier/supplier-interests")}
            />
            <StatCard
              title={t("supplier.dashboard.stats.activeInterests")}
              value={stats.activeInterests}
              icon={<CheckCircle sx={{ color: "#4caf50" }} />}
              color="#4caf50"
              onClick={() => handleNavigateTo("/supplier/supplier-interests")}
            />
            <StatCard
              title={t("supplier.dashboard.stats.availableRequests")}
              value={stats.totalRequests}
              icon={<TrendingUp sx={{ color: "#ff9800" }} />}
              color="#ff9800"
              onClick={() => handleNavigateTo("/supplier/requests")}
            />
            <StatCard
              title={t("supplier.dashboard.stats.productCatalog")}
              value={stats.availableProducts}
              icon={<Inventory sx={{ color: "#9c27b0" }} />}
              color="#9c27b0"
              onClick={() => handleNavigateTo("/supplier/products")}
            />
          </Box>

          {/* Quick Actions */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t("supplier.dashboard.quickActions.title")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Visibility />}
                  onClick={() => handleNavigateTo("/supplier/requests")}
                  sx={{
                    backgroundColor: "#667eea",
                    "&:hover": { backgroundColor: "#5a6fd8" },
                  }}
                >
                  {t("supplier.dashboard.quickActions.viewRequests")}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  onClick={() =>
                    handleNavigateTo("/supplier/supplier-interests")
                  }
                  sx={{
                    borderColor: "#4caf50",
                    color: "#4caf50",
                    "&:hover": {
                      borderColor: "#45a049",
                      backgroundColor: "rgba(76, 175, 80, 0.04)",
                    },
                  }}
                >
                  {t("supplier.dashboard.quickActions.viewInterests")}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Inventory />}
                  onClick={() => handleNavigateTo("/supplier/products")}
                  sx={{
                    borderColor: "#9c27b0",
                    color: "#9c27b0",
                    "&:hover": {
                      borderColor: "#7b1fa2",
                      backgroundColor: "rgba(156, 39, 176, 0.04)",
                    },
                  }}
                >
                  {t("supplier.dashboard.quickActions.productCatalog")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </AuthGuard>
  );
}
