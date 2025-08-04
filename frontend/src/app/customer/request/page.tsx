"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  Assignment,
  Business,
  CalendarToday,
  Inventory,
  CheckCircle,
  Cancel,
  Delete,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/Toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Order, OrderItem, SupplierInterest } from "@/types/order.types";
import { ordersApi } from "@/lib";

export default function CustomerRequestPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Load orders from backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        // Get customer's orders
        const customerOrders = await ordersApi.getMyOrders();
        setOrders(customerOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        showError("Talepler yüklenirken hata oluştu");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [showError]);

  const handleViewDetails = async (order: Order) => {
    try {
      // Get order with supplier interests from backend
      const orderWithSuppliers = await ordersApi.getMyOrderWithSuppliers(
        order.id
      );
      setSelectedOrder(orderWithSuppliers);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Error loading order details:", error);

      // Fallback to basic order data
      setSelectedOrder(order);
      setDetailDialogOpen(true);
    }
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await ordersApi.deleteMyOrder(orderToDelete.id);
      showSuccess("Talep başarıyla silindi");

      // Remove from local state
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      showError("Talep silinirken hata oluştu");
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      PACKAGING: "#4caf50",
      LABELS: "#2196f3",
      CONTAINERS: "#ff9800",
      BAGS: "#9c27b0",
      BOXES: "#795548",
    };
    return colors[type] || "#757575";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AuthGuard requiredRole={UserRole.CUSTOMER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title="Taleplerim" />

        {/* Main Content */}
        <Box
          sx={{
            py: 2,
            px: 3,
            marginLeft: "280px",
            width: "calc(100% - 280px)",
            minHeight: "100vh",
          }}
        >
          {/* Page Header */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Assignment sx={{ fontSize: 32, color: "#667eea" }} />
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    Sipariş Taleplerim
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Oluşturduğunuz talepler ve tedarikçi ilgileri
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box sx={{ p: 3 }}>
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="20%" height={40} />
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="20%" height={40} />
                    </Box>
                  ))}
                </Box>
              ) : orders.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Assignment sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Henüz talep oluşturmadınız
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ürün kataloğundan sipariş oluşturarak başlayın
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Talep No</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Ürün Sayısı
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Toplam Adet
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          İşlemler
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => {
                        const totalQuantity = order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        );
                        return (
                          <TableRow
                            key={order.id}
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.02)",
                              },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body1" fontWeight={500}>
                                #{order.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(order.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {order.items.length} çeşit
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {totalQuantity} adet
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<Visibility />}
                                  onClick={() => handleViewDetails(order)}
                                  sx={{
                                    borderColor: "#667eea",
                                    color: "#667eea",
                                    "&:hover": {
                                      borderColor: "#5a6fd8",
                                      backgroundColor:
                                        "rgba(102, 126, 234, 0.04)",
                                    },
                                  }}
                                >
                                  Detaylar
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<Delete />}
                                  onClick={() => handleDeleteOrder(order)}
                                  sx={{
                                    borderColor: "#f44336",
                                    color: "#f44336",
                                    "&:hover": {
                                      borderColor: "#d32f2f",
                                      backgroundColor:
                                        "rgba(244, 67, 54, 0.04)",
                                    },
                                  }}
                                >
                                  Sil
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Order Detail Dialog */}
          <Dialog
            open={detailDialogOpen}
            onClose={() => setDetailDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight={600} component="div">
                Talep Detayları - #{selectedOrder?.id}
              </Typography>
            </DialogTitle>
            <DialogContent>
              {selectedOrder && (
                <Box sx={{ mt: 1 }}>
                  {/* Order Info */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                    >
                      Talep Bilgileri
                    </Typography>
                    <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Talep Tarihi
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedOrder.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Order Items */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                    >
                      Sipariş Detayları
                    </Typography>
                    <List dense>
                      {selectedOrder.items.map((item) => (
                        <ListItem key={item.id} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Typography variant="body1" fontWeight={500}>
                                  {item.productName}
                                </Typography>
                                <Chip
                                  label={item.productType}
                                  size="small"
                                  sx={{
                                    backgroundColor: getTypeColor(
                                      item.productType
                                    ),
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                            }
                            secondary={`${item.quantity} adet`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Supplier Interests */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                    >
                      Tedarikçi İlgileri
                    </Typography>
                    {selectedOrder.supplierInterests.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Henüz ilgilenen tedarikçi bulunmuyor
                      </Typography>
                    ) : (
                      <List dense>
                        {selectedOrder.supplierInterests.map((interest) => (
                          <ListItem key={interest.id} sx={{ px: 0 }}>
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Typography variant="body1" fontWeight={500}>
                                    {interest.supplierName}
                                  </Typography>
                                  <Chip
                                    label={
                                      interest.isInterested
                                        ? "İlgileniyor"
                                        : "İlgilenmiyor"
                                    }
                                    color={
                                      interest.isInterested
                                        ? "success"
                                        : "error"
                                    }
                                    size="small"
                                    icon={
                                      interest.isInterested ? (
                                        <CheckCircle />
                                      ) : (
                                        <Cancel />
                                      )
                                    }
                                  />
                                </Box>
                              }
                              secondary={
                                interest.notes && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {interest.notes}
                                  </Typography>
                                )
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight={600} component="div">
                Talep Silme Onayı
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  Bu talebi silmek istediğinizden emin misiniz?
                </Typography>
                {orderToDelete && (
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      Talep #{orderToDelete.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {orderToDelete.items.length} çeşit ürün, toplam{" "}
                      {orderToDelete.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      adet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tarih: {formatDate(orderToDelete.createdAt)}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  Bu işlem geri alınamaz!
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
              <Button
                onClick={confirmDeleteOrder}
                variant="contained"
                color="error"
                sx={{
                  "&:hover": {
                    backgroundColor: "#d32f2f",
                  },
                }}
              >
                Sil
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </AuthGuard>
  );
}
