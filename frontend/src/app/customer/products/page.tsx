"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
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
  Paper,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  Search,
  Inventory,
  FilterList,
  Clear,
  ShoppingCart,
  CheckCircle,
  Add,
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

interface Product {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
}

export default function CustomerProductsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const { addToCart, getCartItem, getTotalItems } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Karton Kutu - Küçük Boy",
        type: "Karton Kutu",
        isActive: true,
      },
      {
        id: 2,
        name: "Karton Kutu - Orta Boy",
        type: "Karton Kutu",
        isActive: true,
      },
      {
        id: 3,
        name: "Karton Kutu - Büyük Boy",
        type: "Karton Kutu",
        isActive: true,
      },
      {
        id: 4,
        name: "Plastik Poşet - Şeffaf",
        type: "Plastik Ambalaj",
        isActive: true,
      },
      {
        id: 5,
        name: "Plastik Poşet - Renkli",
        type: "Plastik Ambalaj",
        isActive: true,
      },
      {
        id: 6,
        name: "Cam Şişe - 500ml",
        type: "Cam Ambalaj",
        isActive: true,
      },
      {
        id: 7,
        name: "Cam Şişe - 1L",
        type: "Cam Ambalaj",
        isActive: true,
      },
      {
        id: 8,
        name: "Metal Kutu - Konserve",
        type: "Metal Ambalaj",
        isActive: true,
      },
      {
        id: 9,
        name: "Kağıt Torba - Kraft",
        type: "Kağıt Ambalaj",
        isActive: true,
      },
      {
        id: 10,
        name: "Kağıt Torba - Beyaz",
        type: "Kağıt Ambalaj",
        isActive: true,
      },
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);

    // unique product types
    const types = [...new Set(mockProducts.map((p) => p.type))];
    setAvailableTypes(types);

    setLoading(false);
  }, []);

  // filter
  useEffect(() => {
    let filtered = products.filter((product) => product.isActive);

    // search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTypes.includes(product.type)
      );
    }

    setFilteredProducts(filtered);

    // Show filter results
    if (searchTerm || selectedTypes.length > 0) {
      showInfo(`${filtered.length} ürün bulundu`);
    }
  }, [products, searchTerm, selectedTypes, showInfo]);

  const handleTypeChange = (event: any) => {
    const value = event.target.value;
    setSelectedTypes(typeof value === "string" ? value.split(",") : value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    showInfo("Filtreler temizlendi");
  };

  const handleViewProduct = (product: Product) => {
    showInfo(`${product.name} detayları görüntüleniyor...`);
    console.log("View product:", product);
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product.id, product.name, product.type, quantity);
    showSuccess(`${product.name} sepete eklendi (${quantity} adet)`);

    // Miktarı sıfırla
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));
  };

  const handleQuantityChange = (productId: number, value: string) => {
    const numValue = parseInt(value) || 1;
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, numValue),
    }));
  };

  const handleCompleteOrder = () => {
    router.push("/customer/orders");
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

  const hasItemsInCart = getTotalItems() > 0;

  return (
    <AuthGuard requiredRole={UserRole.CUSTOMER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header
          title="Ürün Kataloğu"
          subtitle={`Hoş geldin ${user?.username || ""}`}
        />

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
                  placeholder="Ürün adı veya tipi ile arayın..."
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
                    Filtrele:
                  </Typography>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Ürün Tipi</InputLabel>
                    <Select
                      multiple
                      value={selectedTypes}
                      onChange={handleTypeChange}
                      label="Ürün Tipi"
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
                      Filtreleri Temizle
                    </Button>
                  )}

                  {/* Dynamic Action Button */}
                  <Box sx={{ ml: "auto" }}>
                    {hasItemsInCart && (
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
                        Talep Tamamla ({getTotalItems()})
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Results Count */}
                <Typography variant="body2" color="text.secondary">
                  {filteredProducts.length} ürün bulundu
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box sx={{ p: 3 }}>
                  {[...Array(5)].map((_, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Skeleton variant="text" width="40%" height={40} />
                      <Skeleton variant="text" width="20%" height={40} />
                      <Skeleton variant="text" width="20%" height={40} />
                      <Skeleton variant="text" width="20%" height={40} />
                    </Box>
                  ))}
                </Box>
              ) : filteredProducts.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Inventory sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Ürün bulunamadı
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Arama kriterlerinizi değiştirmeyi deneyin
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Ürün Adı</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Ürün Tipi
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          Miktar
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          İşlemler
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const cartItem = getCartItem(product.id);
                        return (
                          <TableRow
                            key={product.id}
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.02)",
                              },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body1" fontWeight={500}>
                                {product.name}
                              </Typography>
                              {cartItem && (
                                <Typography
                                  variant="caption"
                                  color="success.main"
                                >
                                  Sepette: {cartItem.quantity} adet
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={product.type}
                                size="small"
                                sx={{
                                  backgroundColor: getTypeColor(product.type),
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <TextField
                                type="number"
                                size="small"
                                value={quantities[product.id] || 1}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    product.id,
                                    e.target.value
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
                                  variant="contained"
                                  size="small"
                                  startIcon={<ShoppingCart />}
                                  onClick={() => handleAddToCart(product)}
                                  sx={{
                                    background:
                                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    "&:hover": {
                                      background:
                                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                    },
                                    fontSize: "0.75rem",
                                    px: 1.5,
                                    py: 0.5,
                                  }}
                                >
                                  Sepete Ekle
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
        </Box>
      </Box>
    </AuthGuard>
  );
}
