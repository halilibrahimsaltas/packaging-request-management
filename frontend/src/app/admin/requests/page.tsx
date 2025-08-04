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
  Avatar,
} from "@mui/material";
import {
  Visibility,
  Assignment,
  Business,
  CalendarToday,
  Inventory,
  CheckCircle,
  Cancel,
  Person,
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

export default function AdminRequestsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Load all orders from backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        // Get all orders (admin can see all)
        const allOrders = await ordersApi.getAllOrdersWithSupplierInterests();
        setOrders(allOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        showError(t("admin.requests.error.load"));
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
      const orderWithSuppliers = await ordersApi.getOrderWithSupplierInterests(
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

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AuthGuard requiredRole={UserRole.ADMIN}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title={t("admin.requests.title")} />

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
                    {t("admin.requests.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.requests.subtitle")}
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
                      <Skeleton variant="text" width="20%" height={40} />
                      <Skeleton variant="text" width="25%" height={40} />
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="25%" height={40} />
                    </Box>
                  ))}
                </Box>
              ) : orders.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Assignment sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("admin.requests.empty.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.requests.empty.subtitle")}
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("admin.requests.table.customer")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("admin.requests.table.products")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("admin.requests.table.totalQuantity")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("admin.requests.table.date")}
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          {t("admin.requests.table.actions")}
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
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: "#667eea",
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  {getInitials(order.customerName)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight={500}>
                                    {order.customerName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    ID: {order.customerId}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                }}
                              >
                                {order.items.map((item, index) => (
                                  <Box
                                    key={item.id}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight={500}
                                    >
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
                                        fontSize: "0.7rem",
                                        height: "20px",
                                      }}
                                    />
                                  </Box>
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {totalQuantity} {t("common.quantity")}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {order.items.length} {t("common.types")}
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
                            <TableCell sx={{ textAlign: "center" }}>
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
                                {t("admin.requests.actions.view")}
                              </Button>
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
                {t("admin.requests.dialog.details.title", {
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
                      {t("admin.requests.dialog.details.info")}
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 4, mb: 2, flexWrap: "wrap" }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("admin.requests.dialog.details.customer")}
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
                            {getInitials(selectedOrder.customerName)}
                          </Avatar>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedOrder.customerName}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("admin.requests.dialog.details.date")}
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
                      {t("admin.requests.dialog.details.items")}
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
                      {t("admin.requests.dialog.details.suppliers")}
                    </Typography>
                    {selectedOrder.supplierInterests.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t("admin.requests.dialog.details.noSuppliers")}
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
                {t("admin.requests.dialog.details.close")}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </AuthGuard>
  );
}
