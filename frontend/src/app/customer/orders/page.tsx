"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Delete,
  ShoppingCart,
  CheckCircle,
  Inventory,
  Add,
  Remove,
  Clear,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/Toast";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ordersApi } from "@/lib";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalItems } =
    useCart();
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      showInfo("Ürün sepetten kaldırıldı");
    } else {
      updateQuantity(productId, newQuantity);
      showInfo("Miktar güncellendi");
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    showInfo("Ürün sepetten kaldırıldı");
  };

  const handleClearCart = () => {
    clearCart();
    showInfo("Sepet temizlendi");
  };

  const handleCompleteOrder = () => {
    if (items.length === 0) {
      showError("Sepetiniz boş!");
      return;
    }
    setConfirmDialogOpen(true);
  };

  const handleAddProducts = () => {
    router.push("/customer/products");
  };

  const confirmOrder = async () => {
    try {
      if (!user?.id) {
        showError("Kullanıcı bilgisi bulunamadı!");
        return;
      }

      // Backend'e gönderilecek veri formatı
      const orderData = {
        customerId: user.id,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      console.log("Sipariş verisi:", orderData);

      // Backend API çağrısı
      const response = await ordersApi.createOrder(orderData);

      showSuccess("Siparişiniz başarıyla oluşturuldu!");
      clearCart();
      setConfirmDialogOpen(false);

      // Talep sayfasına yönlendir
      router.push("/customer/request");
    } catch (error) {
      showError("Sipariş oluşturulurken hata oluştu!");
      console.error("Order creation error:", error);
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

  return (
    <AuthGuard requiredRole={UserRole.CUSTOMER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title="Siparişlerim" />

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
          {/* Cart Summary */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <ShoppingCart sx={{ fontSize: 32, color: "#667eea" }} />
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      Sepetim
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {items.length} ürün çeşidi
                    </Typography>
                  </Box>
                </Box>
                {items.length > 0 ? (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Clear />}
                      onClick={handleClearCart}
                      sx={{
                        borderColor: "#f44336",
                        color: "#f44336",
                        "&:hover": {
                          borderColor: "#d32f2f",
                          backgroundColor: "rgba(244, 67, 54, 0.04)",
                        },
                      }}
                    >
                      Sepeti Temizle
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircle />}
                      onClick={handleCompleteOrder}
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        },
                      }}
                    >
                      Siparişi Tamamla
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddProducts}
                    sx={{
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        borderColor: "#5a6fd8",
                        backgroundColor: "rgba(102, 126, 234, 0.04)",
                      },
                    }}
                  >
                    Ürün Ekle
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Cart Items */}
          {items.length === 0 ? (
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <ShoppingCart sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Sepetiniz boş
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Ürün kataloğundan ürün ekleyerek sipariş oluşturabilirsiniz
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddProducts}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    },
                  }}
                >
                  Ürün Kataloğuna Git
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {items.map((item, index) => (
                    <Box key={item.productId}>
                      <ListItem sx={{ px: 3, py: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Typography variant="h6" fontWeight={600}>
                              {item.name}
                            </Typography>
                            <Chip
                              label={item.type}
                              size="small"
                              sx={{
                                backgroundColor: getTypeColor(item.type),
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          </Box>

                          {/* Quantity Controls */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Miktar:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                sx={{
                                  border: "1px solid #e0e0e0",
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                  },
                                }}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <TextField
                                type="number"
                                size="small"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.productId,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                inputProps={{
                                  min: 1,
                                  style: { textAlign: "center", width: "60px" },
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                    width: "80px",
                                  },
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                sx={{
                                  border: "1px solid #e0e0e0",
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                  },
                                }}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>

                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => handleRemoveItem(item.productId)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < items.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Confirm Order Dialog */}
          <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight={600} component="div">
                Siparişi Onayla
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Aşağıdaki ürünler için sipariş oluşturulacak:
                </Alert>

                <List dense>
                  {items.map((item) => (
                    <ListItem key={item.productId} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.quantity} adet`}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Toplam: {getTotalItems()} ürün
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setConfirmDialogOpen(false)}>İptal</Button>
              <Button
                onClick={confirmOrder}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                }}
              >
                Siparişi Onayla
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </AuthGuard>
  );
}
