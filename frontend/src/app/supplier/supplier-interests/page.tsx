"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Assignment, Visibility, Person } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/Toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  Order,
  OrderItem,
  SupplierInterest,
  BackendSupplierInterestResponse,
  BackendOrderDetailResponse,
} from "@/types/order.types";
import { ordersApi, supplierInterestsApi } from "@/lib";

export default function SupplierInterestsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showError } = useToast();

  const [interests, setInterests] = useState<SupplierInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Record<number, any>>({});

  // Load supplier interests from backend
  useEffect(() => {
    const loadInterests = async () => {
      try {
        setLoading(true);
        console.log("Loading supplier interests from backend...");

        // Get supplier interests for current supplier
        const supplierInterests = await supplierInterestsApi.getMyInterests();
        console.log("Supplier interests received:", supplierInterests);

        if (!Array.isArray(supplierInterests)) {
          console.error("Invalid response format:", supplierInterests);
          throw new Error("Invalid response format");
        }

        // Transform backend data to match frontend structure
        const transformedInterests: SupplierInterest[] = supplierInterests.map(
          (interest: BackendSupplierInterestResponse) => {
            console.log("Processing interest:", interest);

            // Store order details for use in display functions
            setOrderDetails((prev) => ({
              ...prev,
              [interest.order.id]: interest.order,
            }));

            return {
              id: interest.id,
              orderId: interest.order.id,
              supplierId: interest.supplier.id,
              supplierName: interest.supplier.username,
              isInterested: interest.isInterested,
              notes: interest.notes || "",
              createdAt: interest.createdAt,
              updatedAt: interest.updatedAt,
            };
          }
        );

        console.log("Transformed interests:", transformedInterests);
        setInterests(transformedInterests);
      } catch (error) {
        console.error("Error loading supplier interests:", error);
        showError("İlgiler yüklenirken hata oluştu");
        setInterests([]);
      } finally {
        setLoading(false);
      }
    };

    loadInterests();
  }, [user?.id, showError]);

  const handleViewDetails = async (interest: SupplierInterest) => {
    try {
      // Check if orderId is valid
      if (!interest.orderId || isNaN(interest.orderId)) {
        showError("Geçersiz talep ID'si");
        return;
      }

      console.log("Loading order details for orderId:", interest.orderId);

      // Get order details from backend
      const orderDetails =
        (await supplierInterestsApi.getOrderDetailForSupplier(
          interest.orderId
        )) as unknown as BackendOrderDetailResponse;

      console.log("Order details received:", orderDetails);

      // Transform backend order data to match frontend structure
      const transformedOrder: Order = {
        id: orderDetails.id,
        customerId: orderDetails.customer.id,
        customerName: orderDetails.customer.username,
        createdAt: orderDetails.createdAt,
        items: orderDetails.items.map((item) => ({
          id: item.id,
          productId: item.product.id,
          productName: item.product.name,
          productType: item.product.type,
          quantity: item.quantity,
        })),
        supplierInterests: [],
        interestedSuppliersCount: 0,
        totalSuppliersCount: 0,
      };

      console.log("Transformed order:", transformedOrder);
      setSelectedOrder(transformedOrder);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Error loading order details:", error);
      showError("Talep detayları yüklenirken hata oluştu");
    }
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

  // Function to get product types from backend data
  const getProductTypes = (orderId: number): string[] => {
    // Get from backend order details
    const backendOrder = orderDetails[orderId];
    if (backendOrder && backendOrder.items) {
      const types = [
        ...new Set(backendOrder.items.map((item: any) => item.product.type)),
      ];
      return types.filter((type): type is string => typeof type === "string");
    }

    // Get from selected order (if details are loaded)
    if (selectedOrder && selectedOrder.id === orderId) {
      const types = [
        ...new Set(selectedOrder.items.map((item) => item.productType)),
      ];
      return types.filter((type): type is string => typeof type === "string");
    }

    return ["Genel"];
  };

  // Function to get product quantity from backend data
  const getProductQuantity = (orderId: number) => {
    // Get from backend order details
    const backendOrder = orderDetails[orderId];
    if (backendOrder && backendOrder.items) {
      const totalQuantity = backendOrder.items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      return `${totalQuantity} adet`;
    }

    // Get from selected order (if details are loaded)
    if (selectedOrder && selectedOrder.id === orderId) {
      const totalQuantity = selectedOrder.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return `${totalQuantity} adet`;
    }

    return "0 adet";
  };

  return (
    <AuthGuard requiredRole={UserRole.SUPPLIER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title="Tedarikçi İlgileri" />

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
          {/* Interests Table */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box sx={{ p: 3 }}>
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="25%" height={40} />
                      <Skeleton variant="text" width="25%" height={40} />
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="20%" height={40} />
                    </Box>
                  ))}
                </Box>
              ) : interests.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Assignment sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    İlgi kaydı bulunamadı
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Henüz herhangi bir talebe ilgi göstermediniz
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Talep ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Ürün Türleri
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Ürün Miktarı
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          İşlemler
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {interests.map((interest) => (
                        <TableRow
                          key={interest.id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.02)",
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" fontWeight={500}>
                              #{interest.orderId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {getProductTypes(interest.orderId).map(
                                (type, index) => (
                                  <Chip
                                    key={index}
                                    label={type}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#667eea",
                                      color: "white",
                                      fontSize: "0.75rem",
                                      height: "20px",
                                    }}
                                  />
                                )
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              color="primary"
                            >
                              {getProductQuantity(interest.orderId)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(interest.createdAt)}
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
                                onClick={() => handleViewDetails(interest)}
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
                                Detayları Gör
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
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
                    <Box
                      sx={{ display: "flex", gap: 4, mb: 2, flexWrap: "wrap" }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Müşteri
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#667eea",
                              width: 24,
                              height: 24,
                            }}
                          >
                            {selectedOrder.customerName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedOrder.customerName}
                          </Typography>
                        </Box>
                      </Box>
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
                                    backgroundColor: "#4caf50",
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
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </AuthGuard>
  );
}
