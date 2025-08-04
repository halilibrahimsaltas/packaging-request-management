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
  Fade,
  Slide,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Business,
  Person,
  Factory,
  Login,
  ArrowForward,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { UserRole } from "@/types/role.type";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();
  const { showLoading, hideLoading } = useLoading();
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
    showLoading("Giriş yapılıyor...");
    setError("");

    try {
      await login(form.email, form.password);

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
    } catch (error: unknown) {
      let errorMessage = "Giriş sırasında bir hata oluştu";

      if (error instanceof Error && error.message) {
        if (error.message.includes("HTTP error!")) {
          try {
            const errorMatch = error.message.match(/\{.*\}/);
            if (errorMatch) {
              const errorData = JSON.parse(errorMatch[0]);
              errorMessage =
                errorData.message || "Giriş sırasında bir hata oluştu";
            }
          } catch {
            errorMessage = error.message;
          }
        } else if (error.message.includes("Invalid credentials")) {
          errorMessage = "E-posta veya şifre hatalı";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Kullanıcı bulunamadı";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Geçersiz e-posta adresi";
        } else if (error.message.includes("Password is required")) {
          errorMessage = "Şifre gereklidir";
        } else if (error.message.includes("Email is required")) {
          errorMessage = "E-posta adresi gereklidir";
        } else if (error.message.includes("Network Error")) {
          errorMessage =
            "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Bağlantı zaman aşımı. Lütfen tekrar deneyin";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
      hideLoading();
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
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
          opacity: 0.3,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 6,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left Side - Branding */}
          <Slide direction="right" in={true} timeout={800}>
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: "center", lg: "left" },
                color: "white",
                mb: { xs: 4, lg: 0 },
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.5rem", md: "4rem", lg: "4.5rem" },
                  textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                {t("app.title")}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  opacity: 0.95,
                  mb: 4,
                  fontSize: { xs: "1.2rem", md: "1.4rem" },
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                {t("app.description")}
              </Typography>

              {/* Feature highlights */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Business sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {t("auth.login.adminPanel")}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("auth.login.adminPanelDesc")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Person sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {t("auth.login.customerManagement")}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("auth.login.customerManagementDesc")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Factory sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {t("auth.login.supplierNotifications")}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("auth.login.supplierNotificationsDesc")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Slide>

          {/* Right Side - Login Form */}
          <Slide direction="left" in={true} timeout={800}>
            <Paper
              elevation={24}
              sx={{
                flex: 1,
                maxWidth: 500,
                p: 5,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
              }}
            >
              <Box textAlign="center" mb={4}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <Login sx={{ fontSize: 40, color: "white" }} />
                </Box>
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={700}
                  sx={{ color: "#2c3e50" }}
                >
                  {t("auth.login.title")}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem" }}
                >
                  {t("auth.login.description")}
                </Typography>
              </Box>

              {error && (
                <Fade in={true}>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      "& .MuiAlert-icon": {
                        fontSize: "1.5rem",
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
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
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                      },
                    },
                  }}
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
                          sx={{ color: "action.active" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  size="large"
                  endIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <ArrowForward />
                    )
                  }
                  sx={{
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      opacity: 0.7,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {isLoading ? "Giriş yapılıyor..." : t("auth.login.button")}
                </Button>
              </form>

              {/* Demo login buttons removed */}

              <Box textAlign="center" mt={4}>
                <Typography variant="body2" color="text.secondary">
                  {t("auth.login.noAccount")}{" "}
                  <Link
                    href="/auth/register"
                    style={{
                      color: "#667eea",
                      textDecoration: "none",
                      fontWeight: 600,
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#5a6fd8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#667eea";
                    }}
                  >
                    {t("auth.login.registerLink")}
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
}
