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
  Visibility,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/Toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Product } from "@/types/order.types";
import { productsApi } from "@/lib";

export default function SupplierDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError, showInfo } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log("Loading products from backend...");

        // Get active products
        const activeProducts = await productsApi.getActiveProducts();
        console.log("Active products received:", activeProducts);
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);

        // Get available product types
        const types = await productsApi.getActiveProductTypes();
        console.log("Product types received:", types);
        setAvailableTypes(types);
      } catch (error) {
        console.error("Error loading products:", error);
        showError("Ürünler yüklenirken hata oluştu");

        // Fallback to mock data if API fails
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
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setAvailableTypes([...new Set(mockProducts.map((p) => p.type))]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [showError]);

  // Filter products
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
  }, [products, searchTerm, selectedTypes]);

  const handleTypeChange = (event: any) => {
    const value = event.target.value;
    setSelectedTypes(typeof value === "string" ? value.split(",") : value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
  };

  const handleViewProduct = (product: Product) => {
    console.log("View product:", product);
    showInfo(`${product.name} ürünü görüntüleniyor`);
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
    <AuthGuard requiredRole={UserRole.SUPPLIER}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title="Ürün Kataloğu" />

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
                          Durum
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((product) => (
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
                            <Chip
                              label={product.isActive ? "Aktif" : "Pasif"}
                              color={product.isActive ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
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
