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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Fab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Inventory,
  FilterList,
  Clear,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
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

export default function AdminProductsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError, showInfo } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    isActive: true,
  });

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        // Get all products (admin can see all)
        const allProducts = await productsApi.getAllProducts();
        console.log("All products received:", allProducts);
        setProducts(allProducts);
        setFilteredProducts(allProducts);

        // Get available product types
        const types = await productsApi.getActiveProductTypes();
        setAvailableTypes(types);
      } catch (error) {
        console.error("Error loading products:", error);
        showError(t("admin.products.error.load"));
        setProducts([]);
        setFilteredProducts([]);
        setAvailableTypes([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [showError, t]);

  // Filter products
  useEffect(() => {
    let filtered = products;

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

  const handleCreateProduct = async () => {
    try {
      const createdProduct = await productsApi.createProduct(newProduct);
      setProducts([...products, createdProduct]);
      setCreateDialogOpen(false);
      setNewProduct({ name: "", type: "", isActive: true });
      showSuccess(t("admin.products.success.created"));
    } catch (error) {
      console.error("Error creating product:", error);
      showError(t("admin.products.error.create"));
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const updatedProduct = await productsApi.updateProduct(
        selectedProduct.id,
        newProduct
      );
      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
      );
      setEditDialogOpen(false);
      setSelectedProduct(null);
      setNewProduct({ name: "", type: "", isActive: true });
      showSuccess(t("admin.products.success.updated"));
    } catch (error) {
      console.error("Error updating product:", error);
      showError(t("admin.products.error.update"));
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const updatedProduct = await productsApi.updateProduct(product.id, {
        isActive: !product.isActive,
      });
      setProducts(
        products.map((p) => (p.id === product.id ? updatedProduct : p))
      );
      const status = updatedProduct.isActive
        ? t("admin.products.status.active")
        : t("admin.products.status.inactive");
      showSuccess(t("admin.products.success.toggled", { status }));
    } catch (error) {
      console.error("Error toggling product status:", error);
      showError(t("admin.products.error.toggle"));
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await productsApi.deleteProduct(product.id);
      setProducts(products.filter((p) => p.id !== product.id));
      showSuccess(t("admin.products.success.deleted"));
    } catch (error) {
      console.error("Error deleting product:", error);
      showError(t("admin.products.error.delete"));
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      type: product.type,
      isActive: product.isActive,
    });
    setEditDialogOpen(true);
  };

  // Responsive sidebar width - same as Sidebar component
  const getSidebarWidth = () => {
    if (isSmallScreen) return "200px";
    if (isTablet) return "240px";
    return "280px";
  };

  return (
    <AuthGuard requiredRole={UserRole.ADMIN}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header title={t("admin.products.title")} />

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
          {/* Search and Filter Section */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Search Bar */}
                <TextField
                  fullWidth
                  placeholder={t("admin.products.search.placeholder")}
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
                    {t("admin.products.filter.title")}
                  </Typography>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>{t("admin.products.filter.type")}</InputLabel>
                    <Select
                      multiple
                      value={selectedTypes}
                      onChange={handleTypeChange}
                      label={t("admin.products.filter.type")}
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
                                color: "black",
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
                              color: "black",
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
                      {t("admin.products.filter.clear")}
                    </Button>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => {
                        setNewProduct({ name: "", type: "", isActive: true });
                        setCreateDialogOpen(true);
                      }}
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        },
                      }}
                    >
                      {t("admin.products.new.button")}
                    </Button>
                  </Box>
                </Box>

                {/* Results Count */}
                <Typography variant="body2" color="text.secondary">
                  {t("admin.products.results.count", {
                    count: filteredProducts.length,
                  })}
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
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="25%" height={40} />
                    </Box>
                  ))}
                </Box>
              ) : filteredProducts.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Inventory sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("admin.products.empty.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.products.empty.subtitle")}
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("admin.products.table.name")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t("admin.products.table.type")}
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          {t("admin.products.table.status")}
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, textAlign: "center" }}
                        >
                          {t("admin.products.table.actions")}
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
                                color: "black",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Chip
                              label={
                                product.isActive
                                  ? t("admin.products.status.active")
                                  : t("admin.products.status.inactive")
                              }
                              color={product.isActive ? "success" : "default"}
                              size="small"
                              icon={
                                product.isActive ? (
                                  <Visibility fontSize="small" />
                                ) : (
                                  <VisibilityOff fontSize="small" />
                                )
                              }
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
                                variant="outlined"
                                size="small"
                                startIcon={<Edit />}
                                onClick={() => handleEditProduct(product)}
                                sx={{
                                  borderColor: "#2196f3",
                                  color: "#2196f3",
                                  "&:hover": {
                                    borderColor: "#1976d2",
                                    backgroundColor: "rgba(33, 150, 243, 0.04)",
                                  },
                                }}
                              >
                                {t("admin.products.actions.edit")}
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleToggleActive(product)}
                                sx={{
                                  borderColor: product.isActive
                                    ? "#f44336"
                                    : "#4caf50",
                                  color: product.isActive
                                    ? "#f44336"
                                    : "#4caf50",
                                  "&:hover": {
                                    borderColor: product.isActive
                                      ? "#d32f2f"
                                      : "#388e3c",
                                    backgroundColor: product.isActive
                                      ? "rgba(244, 67, 54, 0.04)"
                                      : "rgba(76, 175, 80, 0.04)",
                                  },
                                }}
                              >
                                {product.isActive
                                  ? t("admin.products.actions.makeInactive")
                                  : t("admin.products.actions.makeActive")}
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteProduct(product)}
                                sx={{
                                  borderColor: "#f44336",
                                  color: "#f44336",
                                  "&:hover": {
                                    borderColor: "#d32f2f",
                                    backgroundColor: "rgba(244, 67, 54, 0.04)",
                                  },
                                }}
                              >
                                {t("admin.products.actions.delete")}
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

          {/* Create Product Dialog */}
          <Dialog
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight={600} component="div">
                {t("admin.products.dialog.create.title")}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label={t("admin.products.dialog.name.label")}
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder={t("admin.products.dialog.name.placeholder")}
                />
                <TextField
                  fullWidth
                  label={t("admin.products.dialog.type.label")}
                  value={newProduct.type}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, type: e.target.value })
                  }
                  placeholder={t("admin.products.dialog.type.placeholder")}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newProduct.isActive}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          isActive: e.target.checked,
                        })
                      }
                    />
                  }
                  label={t("admin.products.dialog.active.label")}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setCreateDialogOpen(false)}>
                {t("admin.products.dialog.cancel")}
              </Button>
              <Button
                onClick={handleCreateProduct}
                variant="contained"
                disabled={!newProduct.name || !newProduct.type}
              >
                {t("admin.products.dialog.create")}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Product Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight={600} component="div">
                {t("admin.products.dialog.edit.title")}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label={t("admin.products.dialog.name.label")}
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label={t("admin.products.dialog.type.label")}
                  value={newProduct.type}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, type: e.target.value })
                  }
                  placeholder={t("admin.products.dialog.type.placeholder")}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newProduct.isActive}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          isActive: e.target.checked,
                        })
                      }
                    />
                  }
                  label={t("admin.products.dialog.active.label")}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setEditDialogOpen(false)}>
                {t("admin.products.dialog.cancel")}
              </Button>
              <Button
                onClick={handleUpdateProduct}
                variant="contained"
                disabled={!newProduct.name || !newProduct.type}
              >
                {t("admin.products.dialog.update")}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </AuthGuard>
  );
}
