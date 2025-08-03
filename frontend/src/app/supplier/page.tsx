"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  Assignment,
  FilterList,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function SupplierDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const supplierActions = [
    {
      title: t("dashboard.supplier.viewRequests"),
      description: t("dashboard.supplier.viewRequestsDesc"),
      icon: <Assignment />,
      color: "#667eea",
      action: () => console.log("Talepleri görüntüle"),
    },
    {
      title: t("dashboard.supplier.filter"),
      description: t("dashboard.supplier.filterDesc"),
      icon: <FilterList />,
      color: "#f093fb",
      action: () => console.log("Filtrele"),
    },
    {
      title: t("dashboard.supplier.interested"),
      description: t("dashboard.supplier.interestedDesc"),
      icon: <CheckCircle />,
      color: "#4facfe",
      action: () => console.log("İlgilendiğim"),
    },
  ];

  return (
    <AuthGuard requiredRole={UserRole.SUPPLIER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header
          title={t("dashboard.supplier.title")}
          subtitle={t("dashboard.supplier.subtitle").replace(
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
            {t("dashboard.supplier.supplierOperations")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {supplierActions.map((action, index) => (
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
                      {t("dashboard.supplier.start")}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {/* interest example */}
          <Box
            sx={{
              mt: 6,
              p: 3,
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t("dashboard.supplier.interestExample")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("dashboard.supplier.interestExampleDesc")}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                sx={{
                  bgcolor: "#4caf50",
                  "&:hover": { bgcolor: "#45a049" },
                }}
              >
                {t("dashboard.supplier.interested")}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                sx={{
                  borderColor: "#f44336",
                  color: "#f44336",
                  "&:hover": {
                    borderColor: "#d32f2f",
                    bgcolor: "rgba(244, 67, 54, 0.1)",
                  },
                }}
              >
                {t("dashboard.supplier.notInterested")}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </AuthGuard>
  );
}
