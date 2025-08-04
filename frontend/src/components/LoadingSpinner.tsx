"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ 
  message, 
  size = "medium", 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const { t } = useLanguage();
  
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };

  const defaultMessage = t("loading");

  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <CircularProgress 
        size={sizeMap[size]} 
        thickness={4}
        sx={{
          color: "primary.main",
        }}
      />
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        {message || defaultMessage}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="rgba(255, 255, 255, 0.9)"
        zIndex={9999}
        sx={{
          backdropFilter: "blur(4px)",
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      width="100%"
    >
      {content}
    </Box>
  );
}; 