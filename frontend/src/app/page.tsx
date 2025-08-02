"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { UserRole } from "@/types/role.type";
import { useRouter } from "next/navigation";

export default function Home() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulated login process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login(role);

      // Redirect based on role
      switch (role) {
        case UserRole.ADMIN:
          router.push("/admin");
          break;
        case UserRole.CUSTOMER:
          router.push("/customer");
          break;
        case UserRole.SUPPLIER:
          router.push("/supplier");
          break;
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleCards = [
    {
      role: UserRole.ADMIN,
      titleKey: "home.admin.title",
      descriptionKey: "home.admin.description",
      icon: "👨‍💼",
      color: "#1976d2",
    },
    {
      role: UserRole.CUSTOMER,
      titleKey: "home.customer.title",
      descriptionKey: "home.customer.description",
      icon: "👤",
      color: "#2e7d32",
    },
    {
      role: UserRole.SUPPLIER,
      titleKey: "home.supplier.title",
      descriptionKey: "home.supplier.description",
      icon: "🏢",
      color: "#ed6c02",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t("home.title")}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t("home.subtitle")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {roleCards.map((card) => (
          <Box key={card.role}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  flexGrow: 1,
                  py: 4,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: card.color,
                    width: 80,
                    height: 80,
                    mb: 2,
                    fontSize: "2rem",
                  }}
                >
                  {card.icon}
                </Avatar>
                <Typography variant="h5" component="h2" gutterBottom>
                  {t(card.titleKey)}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ flexGrow: 1 }}
                >
                  {t(card.descriptionKey)}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleLogin(card.role)}
                  disabled={isLoading}
                  sx={{
                    bgcolor: card.color,
                    "&:hover": {
                      bgcolor: card.color,
                      opacity: 0.9,
                    },
                  }}
                >
                  {isLoading ? t("home.login.loading") : t("home.login.button")}
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box textAlign="center" mt={6}>
        <Typography variant="body2" color="text.secondary">
          {t("home.footer")}
        </Typography>
      </Box>
    </Container>
  );
}
