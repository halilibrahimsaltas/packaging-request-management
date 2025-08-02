"use client";

import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
  };

  return (
    <AuthGuard requiredRole={UserRole.CUSTOMER}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Müşteri Paneli
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Hoş geldiniz, {user?.username}!
          </Typography>
          <Button variant="outlined" onClick={handleLogout} sx={{ mt: 2 }}>
            Çıkış Yap
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                Yeni Talep
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Yeni sipariş talebi oluşturun
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                Taleplerim
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Oluşturduğunuz talepleri görüntüleyin
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                Tedarikçiler
              </Typography>
              <Typography variant="body1" color="text.secondary">
                İlgilenen tedarikçileri görüntüleyin
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </AuthGuard>
  );
}
