"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { config, Lang } from "@/config";
import { UI, UIStrings } from "./ui";

const STORAGE_KEY = "mcd-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; ui: UIStrings };

const LanguageContext = createContext<Ctx>({
  lang: config.defaultLanguage,
  setLang: () => {},
  ui: UI[config.defaultLanguage],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(config.defaultLanguage);

  // Restore the saved choice after hydration (static HTML uses the default language).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "es" || saved === "en") setLangState(saved);
    } catch {
      /* storage unavailable — keep default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, ui: UI[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
