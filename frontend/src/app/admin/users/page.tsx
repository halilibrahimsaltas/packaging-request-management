"use client";

import { useState, useEffect } from "react";
import {
  Box,
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
  Skeleton,
  Avatar,
} from "@mui/material";
import {
  Search,
  People,
  FilterList,
  Clear,
  AdminPanelSettings,
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { UserRole } from "@/types/role.type";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/Toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { User } from "@/types/order.types";
import { usersApi } from "@/lib";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Load users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        console.log("Loading users from backend...");

        // Get all users
        const allUsers = await usersApi.getAllUsers();
        console.log("All users received:", allUsers);
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        showError("Kullanıcılar yüklenirken hata oluştu");
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [showError]);

  // Filter users
  useEffect(() => {
    let filtered = users;

    // search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // role filter
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((user) => selectedRoles.includes(user.role));
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRoles]);

  const handleRoleChange = (event: any) => {
    const value = event.target.value;
    setSelectedRoles(typeof value === "string" ? value.split(",") : value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoles([]);
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      ADMIN: "#f44336",
      CUSTOMER: "#2196f3",
      SUPPLIER: "#4caf50",
    };
    return colors[role] || "#757575";
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <AdminPanelSettings fontSize="small" />;
      case "CUSTOMER":
        return <Person fontSize="small" />;
      case "SUPPLIER":
        return <Business fontSize="small" />;
      default:
        return <Person fontSize="small" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Yönetici";
      case "CUSTOMER":
        return "Müşteri";
      case "SUPPLIER":
        return "Tedarikçi";
      default:
        return role;
    }
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
        <Header title="Kullanıcı Yönetimi" />

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
                  placeholder="Kullanıcı adı veya email ile arayın..."
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
                    <InputLabel>Kullanıcı Rolü</InputLabel>
                    <Select
                      multiple
                      value={selectedRoles}
                      onChange={handleRoleChange}
                      label="Kullanıcı Rolü"
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={getRoleText(value)}
                              size="small"
                              sx={{
                                backgroundColor: getRoleColor(value),
                                color: "white",
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="ADMIN">
                        <Chip
                          label="Yönetici"
                          size="small"
                          sx={{
                            backgroundColor: getRoleColor("ADMIN"),
                            color: "white",
                          }}
                        />
                      </MenuItem>
                      <MenuItem value="CUSTOMER">
                        <Chip
                          label="Müşteri"
                          size="small"
                          sx={{
                            backgroundColor: getRoleColor("CUSTOMER"),
                            color: "white",
                          }}
                        />
                      </MenuItem>
                      <MenuItem value="SUPPLIER">
                        <Chip
                          label="Tedarikçi"
                          size="small"
                          sx={{
                            backgroundColor: getRoleColor("SUPPLIER"),
                            color: "white",
                          }}
                        />
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {(searchTerm || selectedRoles.length > 0) && (
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
                  {filteredUsers.length} kullanıcı bulundu
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box sx={{ p: 3 }}>
                  {[...Array(5)].map((_, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="text" width="25%" height={40} />
                      <Skeleton variant="text" width="25%" height={40} />
                      <Skeleton variant="text" width="15%" height={40} />
                      <Skeleton variant="text" width="20%" height={40} />
                    </Box>
                  ))}
                </Box>
              ) : filteredUsers.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <People sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Kullanıcı bulunamadı
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
                        <TableCell sx={{ fontWeight: 600 }}>
                          Kullanıcı
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>İletişim</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Adres</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
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
                                  bgcolor: getRoleColor(user.role),
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                {getInitials(user.username)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={500}>
                                  {user.username}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ID: {user.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Email fontSize="small" color="action" />
                              <Typography variant="body2">
                                {user.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getRoleText(user.role)}
                              size="small"
                              icon={getRoleIcon(user.role)}
                              sx={{
                                backgroundColor: getRoleColor(user.role),
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {user.phone ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {user.phone}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Belirtilmemiş
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.address ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {user.address}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Belirtilmemiş
                              </Typography>
                            )}
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
