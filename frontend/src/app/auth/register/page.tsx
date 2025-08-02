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
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Business,
  Factory,
  CheckCircle,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return false;
    }
    if (form.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await register({
        username: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setSuccess(
        "Hesabınız başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz..."
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Kayıt sırasında bir hata oluştu");
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
              Hesap Oluştur
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
              Sistemi kullanmaya başlamak için hesabınızı oluşturun
            </Typography>

            {/* Benefits */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircle sx={{ fontSize: 28 }} />
                <Typography variant="body1">Hızlı ve güvenli kayıt</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircle sx={{ fontSize: 28 }} />
                <Typography variant="body1">Ücretsiz hesap</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircle sx={{ fontSize: 28 }} />
                <Typography variant="body1">7/24 destek</Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Register Form */}
          <Paper
            elevation={24}
            sx={{
              flex: 1,
              maxWidth: 500,
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
                {t("auth.register.title")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("auth.register.description")}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label={t("auth.form.name")}
                name="name"
                margin="normal"
                value={form.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

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
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Şifre Tekrar"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                margin="normal"
                value={form.confirmPassword}
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                select
                fullWidth
                label={t("auth.form.role")}
                name="role"
                margin="normal"
                value={form.role}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="CUSTOMER">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person />
                    {t("auth.form.roleCustomer")}
                  </Box>
                </MenuItem>
                <MenuItem value="SUPPLIER">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Factory />
                    {t("auth.form.roleSupplier")}
                  </Box>
                </MenuItem>
              </TextField>

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
                {isLoading
                  ? t("auth.register.loading")
                  : t("auth.register.button")}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Chip label="veya" variant="outlined" />
            </Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {t("auth.register.hasAccount")}{" "}
                <Link
                  href="/auth/login"
                  style={{
                    color: "#667eea",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {t("auth.register.loginLink")}
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
