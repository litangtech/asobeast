"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  UI_LANGUAGE_COOKIE,
  UI_LANGUAGE_MAX_AGE,
  uiText,
  type UiLanguage,
} from "@/lib/ui-language";

type LanguageContext = {
  language: UiLanguage;
  setLanguage: (language: UiLanguage) => void;
  text: (message: string) => string;
};

const UiLanguageContext = createContext<LanguageContext>({
  language: "en",
  setLanguage: () => {},
  text: (message) => message,
});

export function UiLanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: UiLanguage;
  children: ReactNode;
}) {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    const root = document.documentElement;
    const previousLanguage = root.lang;
    root.lang = language;
    return () => {
      root.lang = previousLanguage;
    };
  }, [language]);

  const updateLanguage = useCallback((nextLanguage: UiLanguage) => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${UI_LANGUAGE_COOKIE}=${nextLanguage}; Path=/; Max-Age=${UI_LANGUAGE_MAX_AGE}; SameSite=Lax${secure}`;
    setLanguage(nextLanguage);
  }, []);

  const text = useCallback(
    (message: string) => uiText(language, message),
    [language],
  );

  return (
    <UiLanguageContext value={{ language, setLanguage: updateLanguage, text }}>
      {children}
    </UiLanguageContext>
  );
}

export function useUiLanguage(): LanguageContext {
  return useContext(UiLanguageContext);
}

export function UiText({ message }: { message: string }) {
  const { text } = useUiLanguage();
  return <span>{text(message)}</span>;
}
