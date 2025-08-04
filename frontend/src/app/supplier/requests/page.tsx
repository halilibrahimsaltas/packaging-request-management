"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import {
  Search,
  Assignment,
  FilterList,
  Clear,
  Visibility,
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
import { ordersApi, supplierInterestsApi } from "@/lib";

export default function SupplierRequestsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError, showInfo } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Load orders from backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        console.log("Loading orders from backend...");

        // Get orders by product types for supplier
        const allOrders = await supplierInterestsApi.getOrdersByProductTypes(
          []
        );
        console.log("Orders received:", allOrders);

        if (!Array.isArray(allOrders)) {
          console.error("Invalid response format:", allOrders);
          throw new Error("Invalid response format");
        }

        // Transform backend data to match frontend structure
        const transformedOrders: Order[] = allOrders.map((order) => {
          console.log("Processing order:", order);
          return {
            id: order.id,
            customerId: order.customerId || 0,
            customerName: order.customerName || "Unknown Customer",
            createdAt: order.createdAt,
            items: order.items || [],
            supplierInterests: order.supplierInterests || [],
            interestedSuppliersCount: order.interestedSuppliersCount || 0,
            totalSuppliersCount: order.totalSuppliersCount || 0,
          };
        });

        console.log("Transformed orders:", transformedOrders);
        setOrders(transformedOrders);
        setFilteredOrders(transformedOrders);

        // Extract unique product types from orders
        const types = new Set<string>();
        transformedOrders.forEach((order) => {
          order.items.forEach((item) => {
            types.add(item.productType);
          });
        });
        setAvailableTypes(Array.from(types));
      } catch (error) {
        console.error("Error loading orders:", error);
        showError(t("supplier.requests.error.load"));
        setOrders([]);
        setFilteredOrders([]);
        setAvailableTypes([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [showError, t]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((order) =>
        order.items.some((item) => selectedTypes.includes(item.productType))
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, selectedTypes]);

  const handleTypeChange = (event: any) => {
    const value = event.target.value;
    setSelectedTypes(typeof value === "string" ? value.split(",") : value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
  };

  const handleViewDetails = async (order: Order) => {
    try {
      console.log("Loading details for order:", order.id);

      // Get order detail for supplier from backend
      const orderDetail = await supplierInterestsApi.getOrderDetailForSupplier(
        order.id
      );

      console.log("Order detail received:", orderDetail);

      // Transform backend order data to match frontend structure
      const transformedOrder: Order = {
        id: orderDetail.id,
        customerId: orderDetail.customerId || 0,
        customerName: orderDetail.customerName || "Unknown Customer",
        createdAt: orderDetail.createdAt,
        items: orderDetail.items || [],
        supplierInterests: orderDetail.supplierInterests || [],
        interestedSuppliersCount: orderDetail.interestedSuppliersCount || 0,
        totalSuppliersCount: orderDetail.totalSuppliersCount || 0,
      };

      console.log("Transformed order detail:", transformedOrder);
      setSelectedOrder(transformedOrder);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Error loading order details:", error);
      showError(t("supplier.requests.error.loadDetails"));
    }
  };

  const handleInterest = async (orderId: number, isInterested: boolean) => {
    try {
      const notes = isInterested
        ? "Bu talebe ilgileniyorum"
        : "Bu talebe ilgilenmiyorum";
      await supplierInterestsApi.toggleInterest(orderId, isInterested, notes);
      showSuccess(
        isInterested
          ? t("supplier.requests.success.interested")
          : t("supplier.requests.success.notInterested")
      );
      setDetailDialogOpen(false);

      // Reload orders to reflect the change
      const loadOrders = async () => {
        try {
          const allOrders = await supplierInterestsApi.getOrdersByProductTypes(
            []
          );
          if (Array.isArray(allOrders)) {
            const transformedOrders: Order[] = allOrders.map((order) => ({
              id: order.id,
              customerId: order.customerId || 0,
              customerName: order.customerName || "Unknown Customer",
              createdAt: order.createdAt,
              items: order.items || [],
              supplierInterests: order.supplierInterests || [],
              interestedSuppliersCount: order.interestedSuppliersCount || 0,
              totalSuppliersCount: order.totalSuppliersCount || 0,
            }));
            setOrders(transformedOrders);
            setFilteredOrders(transformedOrders);
          }
        } catch (error) {
          console.error("Error reloading orders:", error);
        }
      };
      loadOrders();
    } catch (error) {
      console.error("Error updating interest:", error);
      showError(t("supplier.requests.error.updateInterest"));
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Karton Kutu": "#4caf50",
      "Plastik Ambalaj": "#2196f3",
      "Cam Ambalaj": "#ff9800",
      "Metal Ambalaj": "#9c27b0",
      "Kağıt Ambalaj": "#795548",
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
    if (!username || typeof username !== "string") {
      return "??";
    }
    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AuthGuard requiredRole={UserRole.SUPPLIER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title={t("supplier.requests.title")} />

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
          {/* Search and Filter Section */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Search Bar */}
                <TextField
                  fullWidth
                  placeholder={t("supplier.requests.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Filter Section */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <FilterList sx={{ color: "text.secondary" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    {t("supplier.requests.filter.title")}
                  </Typography>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>
                      {t("supplier.requests.filter.type")}
                    </InputLabel>
                    <Select
                      multiple
                      value={selectedTypes}
                      onChange={handleTypeChange}
                      label={t("supplier.requests.filter.type")}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              size="small"
                              sx={{
                                backgroundColor: getTypeColor(value),
                                color: "white",
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {availableTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Chip
                            label={type}
                            size="small"
                            sx={{
                              backgroundColor: getTypeColor(type),
                              color: "white",
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {(searchTerm || selectedTypes.length > 0) && (
                    <Button
                      startIcon={<Clear />}
                      onClick={clearFilters}
                      variant="outlined"
                      size="small"
                    >
                      {t("supplier.requests.filter.clear")}
                    </Button>
                  )}
                </Box>

                {/* Results Count */}
                <Typography variant="body2" color="text.secondary">
                  {t("supplier.requests.results.count", {
                    count: filteredOrders.length,
                  })}
                </Typography>
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
              ) : filteredOrders.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Assignment sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("supplier.requests.empty.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("supplier.requests.empty.subtitle")}
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("supplier.requests.table.customer")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("supplier.requests.table.products")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("supplier.requests.table.totalQuantity")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("supplier.requests.table.date")}
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          {t("supplier.requests.table.actions")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders.map((order) => {
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
                                {t("supplier.requests.actions.viewDetails")}
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
                {t("supplier.requests.dialog.details.title", {
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
                      {t("supplier.requests.dialog.details.info")}
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 4, mb: 2, flexWrap: "wrap" }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("supplier.requests.dialog.details.customer")}
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
                          {t("supplier.requests.dialog.details.date")}
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
                      {t("supplier.requests.dialog.details.items")}
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

                  {/* Interest Actions */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                    >
                      {t("supplier.requests.dialog.details.interest.title")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {t(
                        "supplier.requests.dialog.details.interest.description"
                      )}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<CheckCircle />}
                        onClick={() => handleInterest(selectedOrder.id, true)}
                        sx={{
                          bgcolor: "#4caf50",
                          "&:hover": { bgcolor: "#45a049" },
                        }}
                      >
                        {t(
                          "supplier.requests.dialog.details.interest.interested"
                        )}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => handleInterest(selectedOrder.id, false)}
                        sx={{
                          borderColor: "#f44336",
                          color: "#f44336",
                          "&:hover": {
                            borderColor: "#d32f2f",
                            bgcolor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        {t(
                          "supplier.requests.dialog.details.interest.notInterested"
                        )}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDetailDialogOpen(false)}>
                {t("supplier.requests.dialog.details.close")}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </AuthGuard>
  );
}
