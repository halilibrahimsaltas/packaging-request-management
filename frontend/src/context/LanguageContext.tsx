import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "tr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    // Layout
    "app.title": "Ambalaj Talep ve Tedarikçi Bildirim Sistemi",
    "app.description": "Ambalaj talep ve tedarikçi bildirim yönetim sistemi",

    // Home Page
    "home.title": "Ambalaj Talep ve Tedarikçi Bildirim Sistemi",
    "home.subtitle": "Kullanıcı türünüzü seçerek sisteme giriş yapın",
    "home.admin.title": "Yönetici",
    "home.admin.description": "Sistem yönetimi ve genel görünüm",
    "home.customer.title": "Müşteri",
    "home.customer.description": "Sipariş talepleri oluşturma ve takip",
    "home.supplier.title": "Tedarikçi",
    "home.supplier.description": "Talepleri görüntüleme ve ilgilenme",
    "home.login.button": "Giriş Yap",
    "home.login.loading": "Giriş yapılıyor...",
    "home.footer": "© 2024 Ambalaj Talep ve Tedarikçi Bildirim Sistemi",

    // Language
    "language.tr": "Türkçe",
    "language.en": "English",
  },
  en: {
    // Layout
    "app.title": "Packaging Request and Supplier Notification System",
    "app.description":
      "Packaging request and supplier notification management system",

    // Home Page
    "home.title": "Packaging Request and Supplier Notification System",
    "home.subtitle": "Select your user type to login to the system",
    "home.admin.title": "Administrator",
    "home.admin.description": "System management and general overview",
    "home.customer.title": "Customer",
    "home.customer.description": "Create and track order requests",
    "home.supplier.title": "Supplier",
    "home.supplier.description": "View requests and show interest",
    "home.login.button": "Login",
    "home.login.loading": "Logging in...",
    "home.footer": "© 2024 Packaging Request and Supplier Notification System",

    // Language
    "language.tr": "Türkçe",
    "language.en": "English",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("tr");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
