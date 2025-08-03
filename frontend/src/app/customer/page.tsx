"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Button,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RequestList from "@/components/RequestList";

interface Request {
  id: string;
  title: string;
  description: string;
  productType: string;
  quantity: number;
  createdAt: string;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      title: "Karton Kutu Talebi",
      description:
        "Ürünlerimiz için özel boyutlarda karton kutu ihtiyacımız var. Dayanıklı ve kaliteli malzeme tercih ediyoruz.",
      productType: "Karton Kutu",
      quantity: 500,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      title: "Plastik Ambalaj Siparişi",
      description:
        "Gıda ürünleri için güvenli plastik ambalaj gerekiyor. FDA onaylı malzeme şart.",
      productType: "Plastik Ambalaj",
      quantity: 1000,
      createdAt: "2024-01-10T14:20:00Z",
    },
    {
      id: "3",
      title: "Cam Şişe Talebi",
      description:
        "Premium içecek ürünlerimiz için özel tasarım cam şişe ihtiyacımız var.",
      productType: "Cam Ambalaj",
      quantity: 200,
      createdAt: "2024-01-05T09:15:00Z",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleCreateRequest = (
    newRequest: Omit<Request, "id" | "createdAt">
  ) => {
    const request: Request = {
      ...newRequest,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRequests([request, ...requests]);
  };

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  const handleEditRequest = (request: Request) => {
    // Edit functionality can be implemented here
    console.log("Edit request:", request);
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests(requests.filter((req) => req.id !== requestId));
  };

  return (
    <AuthGuard requiredRole={UserRole.CUSTOMER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header
          title={t("dashboard.customer.title")}
          subtitle={t("dashboard.customer.subtitle").replace(
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
            {t("dashboard.customer.customerOperations")}
          </Typography>

          {/* Request List Component */}
          <RequestList
            requests={requests}
            onCreateRequest={handleCreateRequest}
            onViewRequest={handleViewRequest}
            onEditRequest={handleEditRequest}
            onDeleteRequest={handleDeleteRequest}
            userRole="CUSTOMER"
          />

          {/* Request Detail Dialog */}
          <Dialog
            open={detailDialogOpen}
            onClose={() => setDetailDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight={600}>
                Talep Detayları
              </Typography>
            </DialogTitle>
            <DialogContent>
              {selectedRequest && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {selectedRequest.title}
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Açıklama:</strong> {selectedRequest.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ürün Türü
                      </Typography>
                      <Typography variant="body1">
                        {selectedRequest.productType}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Miktar
                      </Typography>
                      <Typography variant="body1">
                        {selectedRequest.quantity}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Oluşturulma Tarihi
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedRequest.createdAt).toLocaleString(
                          "tr-TR"
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}
