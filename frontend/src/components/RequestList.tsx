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
  useTheme,
  useMediaQuery,
  Stack,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
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
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 2, sm: 0 },
          mb: 3,
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h2"
          fontWeight={600}
          sx={{
            fontSize: {
              xs: "1.25rem",
              sm: "1.5rem",
              md: "1.75rem",
            },
          }}
        >
          {userRole === "CUSTOMER"
            ? t("components.requestList.title.customer")
            : t("components.requestList.title.other")}
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
              width: { xs: "100%", sm: "auto" },
              py: { xs: 1.5, sm: 1 },
            }}
          >
            {t("components.requestList.createButton")}
          </Button>
        )}
      </Box>

      {/* Request List */}
      <Card elevation={2} sx={{ borderRadius: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: 0 }}>
          {requests.length === 0 ? (
            <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
              <Inventory
                sx={{
                  fontSize: { xs: 48, sm: 64 },
                  color: "grey.400",
                  mb: 2,
                }}
              />
              <Typography
                variant={isMobile ? "h6" : "h6"}
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.25rem",
                  },
                }}
              >
                {t("components.requestList.empty.title")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                  },
                }}
              >
                {userRole === "CUSTOMER"
                  ? t("components.requestList.empty.subtitle.customer")
                  : t("components.requestList.empty.subtitle.other")}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {requests.map((request, index) => (
                <ListItem
                  key={request.id}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 2 },
                    borderBottom:
                      index < requests.length - 1
                        ? "1px solid #e0e0e0"
                        : "none",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                  }}
                >
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: { xs: 1, sm: 2 },
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant={isMobile ? "h6" : "h6"}
                        fontWeight={600}
                        sx={{
                          fontSize: {
                            xs: "1rem",
                            sm: "1.25rem",
                          },
                        }}
                      >
                        {request.title}
                      </Typography>
                      <Chip
                        icon={<Inventory />}
                        label={request.productType}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                          },
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        fontSize: {
                          xs: "0.875rem",
                          sm: "1rem",
                        },
                      }}
                    >
                      {request.description}
                    </Typography>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 1, sm: 2 }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <Chip
                        icon={<CalendarToday />}
                        label={new Date(request.createdAt).toLocaleDateString(
                          "tr-TR"
                        )}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: {
                            xs: "0.875rem",
                            sm: "1rem",
                          },
                        }}
                      >
                        {t("components.requestList.quantity.label", {
                          quantity: request.quantity,
                        })}
                      </Typography>
                    </Stack>
                  </Box>
                  <ListItemSecondaryAction
                    sx={{
                      position: { xs: "static", sm: "relative" },
                      transform: { xs: "none", sm: "translateX(0)" },
                      mt: { xs: 2, sm: 0 },
                      display: "flex",
                      justifyContent: { xs: "flex-end", sm: "flex-start" },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => onViewRequest(request)}
                        size={isMobile ? "medium" : "small"}
                      >
                        <Visibility />
                      </IconButton>
                      {userRole === "CUSTOMER" && onEditRequest && (
                        <IconButton
                          onClick={() => onEditRequest(request)}
                          size={isMobile ? "medium" : "small"}
                        >
                          <Edit />
                        </IconButton>
                      )}
                      {userRole === "CUSTOMER" && onDeleteRequest && (
                        <IconButton
                          onClick={() => onDeleteRequest(request.id)}
                          size={isMobile ? "medium" : "small"}
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
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 2, sm: 4 },
            width: { xs: "calc(100% - 32px)", sm: "auto" },
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant={isMobile ? "h6" : "h6"}
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "1.1rem",
                sm: "1.25rem",
              },
            }}
          >
            {t("components.requestList.dialog.create.title")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
            }}
          >
            <TextField
              fullWidth
              label={t("components.requestList.dialog.create.title.label")}
              value={newRequest.title}
              onChange={(e) =>
                setNewRequest({ ...newRequest, title: e.target.value })
              }
              required
              size={isMobile ? "medium" : "small"}
            />
            <TextField
              fullWidth
              label={t(
                "components.requestList.dialog.create.description.label"
              )}
              multiline
              rows={isMobile ? 4 : 3}
              value={newRequest.description}
              onChange={(e) =>
                setNewRequest({ ...newRequest, description: e.target.value })
              }
              required
              size={isMobile ? "medium" : "small"}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 2 }}
            >
              <FormControl fullWidth required>
                <InputLabel>
                  {t("components.requestList.dialog.create.productType.label")}
                </InputLabel>
                <Select
                  value={newRequest.productType}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      productType: e.target.value,
                    })
                  }
                  label={t(
                    "components.requestList.dialog.create.productType.label"
                  )}
                  size={isMobile ? "medium" : "small"}
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
                label={t("components.requestList.dialog.create.quantity.label")}
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
                size={isMobile ? "medium" : "small"}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            size={isMobile ? "large" : "medium"}
          >
            {t("components.requestList.dialog.create.cancel")}
          </Button>
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
            size={isMobile ? "large" : "medium"}
          >
            {t("components.requestList.dialog.create.create")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
