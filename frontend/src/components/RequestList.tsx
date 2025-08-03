"use client";

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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import {
  Add,
  Visibility,
  Edit,
  Delete,
  Inventory,
  CalendarToday,
} from "@mui/icons-material";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Request {
  id: string;
  title: string;
  description: string;
  productType: string;
  quantity: number;
  createdAt: string;
}

interface RequestListProps {
  requests: Request[];
  onCreateRequest: (request: Omit<Request, "id" | "createdAt">) => void;
  onViewRequest: (request: Request) => void;
  onEditRequest?: (request: Request) => void;
  onDeleteRequest?: (requestId: string) => void;
  userRole: "CUSTOMER" | "SUPPLIER" | "ADMIN";
}

export default function RequestList({
  requests,
  onCreateRequest,
  onViewRequest,
  onEditRequest,
  onDeleteRequest,
  userRole,
}: RequestListProps) {
  const { t } = useLanguage();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    productType: "",
    quantity: 1,
  });

  const handleCreateRequest = () => {
    onCreateRequest(newRequest);
    setNewRequest({ title: "", description: "", productType: "", quantity: 1 });
    setCreateDialogOpen(false);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "400px" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight={600}>
          {userRole === "CUSTOMER" ? "Taleplerim" : "Talepler"}
        </Typography>
        {userRole === "CUSTOMER" && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Yeni Talep Oluştur
          </Button>
        )}
      </Box>

      {/* Request List */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          {requests.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Inventory sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Henüz talep bulunmuyor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userRole === "CUSTOMER"
                  ? "İlk talebinizi oluşturmak için yukarıdaki butona tıklayın"
                  : "Henüz size gelen talep bulunmuyor"}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {requests.map((request, index) => (
                <ListItem
                  key={request.id}
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom:
                      index < requests.length - 1
                        ? "1px solid #e0e0e0"
                        : "none",
                  }}
                >
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
                        {request.title}
                      </Typography>
                      <Chip
                        icon={<Inventory />}
                        label={request.productType}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {request.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Chip
                        icon={<CalendarToday />}
                        label={new Date(request.createdAt).toLocaleDateString(
                          "tr-TR"
                        )}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Miktar: {request.quantity}
                      </Typography>
                    </Box>
                  </Box>
                  <ListItemSecondaryAction>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => onViewRequest(request)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      {userRole === "CUSTOMER" && onEditRequest && (
                        <IconButton
                          onClick={() => onEditRequest(request)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      )}
                      {userRole === "CUSTOMER" && onDeleteRequest && (
                        <IconButton
                          onClick={() => onDeleteRequest(request.id)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Create Request Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Yeni Talep Oluştur
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Talep Başlığı"
              value={newRequest.title}
              onChange={(e) =>
                setNewRequest({ ...newRequest, title: e.target.value })
              }
              required
            />
            <TextField
              fullWidth
              label="Açıklama"
              multiline
              rows={3}
              value={newRequest.description}
              onChange={(e) =>
                setNewRequest({ ...newRequest, description: e.target.value })
              }
              required
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Ürün Türü</InputLabel>
                <Select
                  value={newRequest.productType}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      productType: e.target.value,
                    })
                  }
                  label="Ürün Türü"
                >
                  <MenuItem value="Karton Kutu">Karton Kutu</MenuItem>
                  <MenuItem value="Plastik Ambalaj">Plastik Ambalaj</MenuItem>
                  <MenuItem value="Cam Ambalaj">Cam Ambalaj</MenuItem>
                  <MenuItem value="Metal Ambalaj">Metal Ambalaj</MenuItem>
                  <MenuItem value="Kağıt Ambalaj">Kağıt Ambalaj</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Miktar"
                type="number"
                value={newRequest.quantity}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                required
                inputProps={{ min: 1 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>İptal</Button>
          <Button
            onClick={handleCreateRequest}
            variant="contained"
            disabled={
              !newRequest.title ||
              !newRequest.description ||
              !newRequest.productType
            }
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Talep Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
