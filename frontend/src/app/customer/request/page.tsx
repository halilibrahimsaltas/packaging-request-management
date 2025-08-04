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
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

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
        showError(t("customer.requests.error.load"));
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [showError, t]);

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
      await ordersApi.deleteOrder(orderToDelete.id);
      setOrders(orders.filter((o) => o.id !== orderToDelete.id));
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      showSuccess(t("customer.requests.success.deleted"));
    } catch (error) {
      console.error("Error deleting order:", error);
      showError(t("customer.requests.error.delete"));
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      PACKAGING: "#4caf50",
      LABELS: "#2196f3",
      CONTAINERS: "#ff9800",
      BOX: "#9c27b0",
      BAG: "#f44336",
      WRAPPER: "#795548",
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

  // Responsive sidebar width - same as Sidebar component
  const getSidebarWidth = () => {
    if (isSmallScreen) return "200px";
    if (isTablet) return "240px";
    return "280px";
  };

  return (
    <AuthGuard requiredRole={UserRole.CUSTOMER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title={t("customer.requests.title")} />

        {/* Main Content */}
        <Box
          sx={{
            py: 2,
            px: 3,
            marginLeft: {
              xs: 0,
              md: getSidebarWidth(), // Only apply margin on lg and above
            },
            width: {
              xs: "100%",
              md: `calc(100% - ${getSidebarWidth()})`, // Only apply width calculation on lg and above
            },
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
                    {t("customer.requests.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("customer.requests.subtitle")}
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
                    {t("customer.requests.empty.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("customer.requests.empty.subtitle")}
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("customer.requests.table.id")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("customer.requests.table.date")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("customer.requests.table.items")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("customer.requests.table.totalQuantity")}
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          {t("customer.requests.table.actions")}
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
                                {order.items.length} {t("common.types")}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {totalQuantity} {t("common.quantity")}
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
                                  {t("customer.requests.actions.view")}
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
                                  {t("customer.requests.actions.delete")}
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
                {t("customer.requests.dialog.details.title", {
                  id: selectedOrder?.id,
                })}
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
                      {t("customer.requests.dialog.details.info")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("customer.requests.dialog.details.date")}
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
                      {t("customer.requests.dialog.details.items")}
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
                            secondary={`${item.quantity} ${t(
                              "common.quantity"
                            )}`}
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
                      {t("customer.requests.dialog.details.suppliers")}
                    </Typography>
                    {selectedOrder.supplierInterests.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t("customer.requests.dialog.details.noSuppliers")}
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
                                        ? t("common.interested")
                                        : t("common.notInterested")
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
              <Button onClick={() => setDetailDialogOpen(false)}>
                {t("customer.requests.dialog.details.close")}
              </Button>
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
                {t("customer.requests.dialog.delete.title")}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body1" gutterBottom>
                  {t("customer.requests.dialog.delete.message")}
                </Typography>
                {orderToDelete && (
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t("customer.requests.dialog.details.title", {
                        id: orderToDelete.id,
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {orderToDelete.items.length} {t("common.types")}{" "}
                      {t("common.items")}, {t("common.total")}{" "}
                      {orderToDelete.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      {t("common.quantity")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("common.date")}: {formatDate(orderToDelete.createdAt)}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {t("customer.requests.dialog.delete.warning")}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDeleteDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
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
                {t("customer.requests.dialog.delete.confirm")}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </AuthGuard>
  );
}
