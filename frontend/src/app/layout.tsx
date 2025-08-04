"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontSize: "2.5rem",
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "2rem",
      "@media (max-width:600px)": {
        fontSize: "1.75rem",
      },
    },
    h3: {
      fontSize: "1.75rem",
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h4: {
      fontSize: "1.5rem",
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
      },
    },
    h5: {
      fontSize: "1.25rem",
      "@media (max-width:600px)": {
        fontSize: "1.125rem",
      },
    },
    h6: {
      fontSize: "1.125rem",
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            paddingLeft: 16,
            paddingRight: 16,
          },
          "@media (min-width:600px) and (max-width:960px)": {
            paddingLeft: 24,
            paddingRight: 24,
          },
          "@media (min-width:960px)": {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            borderRadius: 8,
          },
          "@media (min-width:600px) and (max-width:960px)": {
            borderRadius: 12,
          },
          "@media (min-width:960px)": {
            borderRadius: 16,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            borderRadius: 6,
            fontSize: "0.875rem",
          },
          "@media (min-width:600px)": {
            borderRadius: 8,
            fontSize: "1rem",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "@media (max-width:600px)": {
              borderRadius: 6,
            },
            "@media (min-width:600px)": {
              borderRadius: 8,
            },
          },
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <title>Ambalaj Talep ve Tedarikçi Bildirim Sistemi</title>
        <meta
          name="description"
          content="Ambalaj talepleri ve tedarikçi bildirimleri için yönetim sistemi"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <LanguageProvider>
              <CartProvider>
                <ToastProvider>
                  <div
                    style={{
                      minHeight: "100vh",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {children}
                  </div>
                </ToastProvider>
              </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
