"use client";

import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Language } from "@mui/icons-material";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Language as LanguageType } from "@/types";

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        startIcon={<Language />}
        onClick={handleClick}
        sx={{ textTransform: "none" }}
      >
        {t(`language.${language}`)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleLanguageChange("tr")}>
          <ListItemIcon>🇹🇷</ListItemIcon>
          <ListItemText>{t("language.tr")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("en")}>
          <ListItemIcon>🇺🇸</ListItemIcon>
          <ListItemText>{t("language.en")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
