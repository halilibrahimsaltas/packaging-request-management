"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { People, Assignment, Inventory, Add } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const adminActions = [
    {
      title: t("dashboard.admin.userManagement"),
      description: t("dashboard.admin.userManagementDesc"),
      icon: <People />,
      color: "#667eea",
      action: () => console.log("Kullanıcı yönetimi"),
    },
    {
      title: t("dashboard.admin.requestManagement"),
      description: t("dashboard.admin.requestManagementDesc"),
      icon: <Assignment />,
      color: "#f093fb",
      action: () => console.log("Talep yönetimi"),
    },
    {
      title: t("dashboard.admin.productCatalog"),
      description: t("dashboard.admin.productCatalogDesc"),
      icon: <Inventory />,
      color: "#4facfe",
      action: () => console.log("Ürün katalogu"),
    },
  ];

  return (
    <AuthGuard requiredRole={UserRole.ADMIN}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header
          title={t("dashboard.admin.title")}
          subtitle={t("dashboard.admin.subtitle").replace(
            "{username}",
            user?.username || ""
          )}
        />

        {/* Main Content */}
        <Container
          maxWidth="lg"
          sx={{
            py: 4,
            pl: { xs: 0, sm: 0 },
            marginLeft: "280px",
            width: "calc(100% - 280px)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 4, fontWeight: 600, color: "#2c3e50" }}
          >
            {t("dashboard.admin.systemManagement")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {adminActions.map((action, index) => (
              <Box
                key={index}
                sx={{
                  flex: "1 1 300px",
                  maxWidth: "400px",
                  minWidth: "280px",
                }}
              >
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={action.action}
                >
                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        backgroundColor: `${action.color}15`,
                        mb: 2,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box sx={{ color: action.color }}>{action.icon}</Box>
                    </Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {action.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {action.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: action.color,
                        color: action.color,
                        "&:hover": {
                          backgroundColor: `${action.color}15`,
                          borderColor: action.color,
                        },
                      }}
                    >
                      {t("dashboard.admin.view")}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </AuthGuard>
  );
}
