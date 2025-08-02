"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SnackbarProvider } from "notistack";
import { CssBaseline, AppBar, Toolbar, Typography } from "@mui/material";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// AppTitle component to use translations
function AppTitle() {
  const { t } = useLanguage();
  return t("app.title");
}

// Layout component to conditionally show AppBar
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      {!isAuthPage && (
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <AppTitle />
            </Typography>
            <LanguageSwitcher />
          </Toolbar>
        </AppBar>
      )}
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <title>Ambalaj Talep ve Tedarikçi Bildirim Sistemi</title>
        <meta
          name="description"
          content="Ambalaj talep ve tedarikçi bildirim yönetim sistemi"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <AuthProvider>
            <SnackbarProvider maxSnack={3}>
              <CssBaseline />
              <LayoutContent>{children}</LayoutContent>
            </SnackbarProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
