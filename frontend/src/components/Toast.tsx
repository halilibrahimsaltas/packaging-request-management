"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import { CheckCircle, Error, Info, Warning, Close } from "@mui/icons-material";

interface ToastContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Provider Component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "warning" | "info">(
    "info"
  );
  const [duration, setDuration] = useState(4000);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info",
    duration: number = 3000
  ) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const showSuccess = (message: string, duration: number = 3000) => {
    showToast(message, "success", duration);
  };

  const showError = (message: string, duration: number = 3000) => {
    showToast(message, "error", duration);
  };

  const showWarning = (message: string, duration: number = 3000) => {
    showToast(message, "warning", duration);
  };

  const showInfo = (message: string, duration: number = 3000) => {
    showToast(message, "info", duration);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle fontSize="small" />;
      case "error":
        return <Error fontSize="small" />;
      case "warning":
        return <Warning fontSize="small" />;
      case "info":
        return <Info fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}

      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbar-root": {
            bottom: { xs: 16, sm: 24 },
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          icon={getIcon(type)}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
              sx={{ color: "white" }}
            >
              <Close fontSize="small" />
            </IconButton>
          }
          sx={{
            width: "100%",
            maxWidth: { xs: "calc(100vw - 32px)", sm: 400 },
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            "& .MuiAlert-message": {
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "white",
            },
            "& .MuiAlert-icon": {
              fontSize: "1.25rem",
              color: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
            "& .MuiAlert-action": {
              color: "white",
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

// Custom hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    console.error("useToast must be used within a ToastProvider");
    return {
      showSuccess: () => {},
      showError: () => {},
      showWarning: () => {},
      showInfo: () => {},
    };
  }
  return context;
}
