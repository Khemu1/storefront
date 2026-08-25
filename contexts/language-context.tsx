"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageContextType {
  lang: "ar" | "en";
  dir: "rtl" | "ltr";
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  dir: "rtl",
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState<"ar" | "en">(
    (i18n.language as "ar" | "en") || "ar",
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  const toggleLang = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
