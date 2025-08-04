"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect to login page
    router.push("/auth/login");
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <CircularProgress size={40} />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontSize: {
            xs: "0.875rem",
            sm: "1rem",
          },
        }}
      >
        {t("common.redirecting")}
      </Typography>
    </Box>
  );
}
