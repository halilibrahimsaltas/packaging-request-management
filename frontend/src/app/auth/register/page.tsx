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
  Fade,
  Slide,
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
  PersonAdd,
  ArrowForward,
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
      setError(t("auth.register.passwordMismatch"));
      return false;
    }
    if (form.password.length < 6) {
      setError(t("auth.register.passwordTooShort"));
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

      setSuccess(t("auth.register.successMessage"));

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message || t("auth.register.errorMessage"));
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
                {t("auth.register.createAccount")}
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
                {t("auth.register.createAccountDesc")}
              </Typography>

              {/* Benefits */}
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
                    <CheckCircle sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {t("auth.register.fastSecure")}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("auth.register.fastSecureDesc")}
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
                    <CheckCircle sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {t("auth.register.freeAccount")}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("auth.register.freeAccountDesc")}
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
                    <CheckCircle sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {t("auth.register.support247")}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("auth.register.support247Desc")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Slide>

          {/* Right Side - Register Form */}
          <Slide direction="left" in={true} timeout={800}>
            <Paper
              elevation={24}
              sx={{
                flex: 1,
                maxWidth: 550,
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
                  <PersonAdd sx={{ fontSize: 40, color: "white" }} />
                </Box>
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={700}
                  sx={{ color: "#2c3e50" }}
                >
                  {t("auth.register.title")}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem" }}
                >
                  {t("auth.register.description")}
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

              {success && (
                <Fade in={true}>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      "& .MuiAlert-icon": {
                        fontSize: "1.5rem",
                      },
                    }}
                  >
                    {success}
                  </Alert>
                </Fade>
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
                  label={t("auth.form.confirmPassword")}
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
                          sx={{ color: "action.active" }}
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
                  select
                  fullWidth
                  label={t("auth.form.role")}
                  name="role"
                  margin="normal"
                  value={form.role}
                  onChange={handleChange}
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
                  endIcon={isLoading ? null : <ArrowForward />}
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
                  {isLoading
                    ? t("auth.register.loading")
                    : t("auth.register.button")}
                </Button>
              </form>

              <Divider sx={{ my: 4 }}>
                <Chip
                  label={t("common.or")}
                  variant="outlined"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(0,0,0,0.1)",
                  }}
                />
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
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#5a6fd8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#667eea";
                    }}
                  >
                    {t("auth.register.loginLink")}
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
