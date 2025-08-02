"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Business,
  Person,
  Factory,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/role.type";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ email: form.email, password: form.password });

      // Redirect based on user role
      const userRole = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!).role
        : null;

      switch (userRole) {
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
    } catch (error: any) {
      setError(error.message || "Giriş sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (
    role: UserRole,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });

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
    } catch (error: any) {
      setError(error.message || "Giriş sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
            alignItems: "center",
          }}
        >
          {/* Left Side - Branding */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", lg: "left" },
              color: "white",
              mb: { xs: 4, lg: 0 },
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {t("app.title")}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mb: 4,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                lineHeight: 1.6,
              }}
            >
              {t("app.description")}
            </Typography>

            {/* Feature highlights */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Business sx={{ fontSize: 28 }} />
                <Typography variant="body1">Yönetici Paneli</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Person sx={{ fontSize: 28 }} />
                <Typography variant="body1">Müşteri Yönetimi</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Factory sx={{ fontSize: 28 }} />
                <Typography variant="body1">Tedarikçi Bildirimleri</Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Login Form */}
          <Paper
            elevation={24}
            sx={{
              flex: 1,
              maxWidth: 450,
              p: 4,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                fontWeight={600}
              >
                {t("auth.login.title")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("auth.login.description")}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label={t("auth.form.email")}
                name="email"
                type="email"
                margin="normal"
                value={form.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t("auth.form.password")}
                name="password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                value={form.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                }}
              >
                {isLoading ? t("auth.login.loading") : t("auth.login.button")}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Chip label="veya" variant="outlined" />
            </Divider>

            {/* Quick Login Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mb={2}
              >
                Demo hesapları ile hızlı giriş:
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                onClick={() =>
                  quickLogin(UserRole.ADMIN, "admin@example.com", "admin123")
                }
                disabled={isLoading}
                startIcon={<Business />}
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Yönetici Demo
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() =>
                  quickLogin(
                    UserRole.CUSTOMER,
                    "customer@example.com",
                    "customer123"
                  )
                }
                disabled={isLoading}
                startIcon={<Person />}
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Müşteri Demo
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() =>
                  quickLogin(
                    UserRole.SUPPLIER,
                    "supplier@example.com",
                    "supplier123"
                  )
                }
                disabled={isLoading}
                startIcon={<Factory />}
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Tedarikçi Demo
              </Button>
            </Box>

            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                {t("auth.login.noAccount")}{" "}
                <Link
                  href="/auth/register"
                  style={{
                    color: "#667eea",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {t("auth.login.registerLink")}
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
