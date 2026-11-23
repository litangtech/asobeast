"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_LANGUAGES, uiLanguageFromCookie } from "@/lib/ui-language";
import { useUiLanguage } from "./UiLanguage";

const NATIVE_LABELS = {
  en: "English",
  "zh-CN": "简体中文",
} as const;

export function LanguageSetting() {
  const { language, setLanguage, text } = useUiLanguage();

  return (
    <section
      aria-labelledby="ui-language-heading"
      className="flex flex-col items-start gap-3"
    >
      <div className="flex flex-col gap-0.5">
        <h2 id="ui-language-heading" className="text-title tracking-tight">
          <span>{text("Language")}</span>
        </h2>
        <p className="text-body text-muted-foreground">
          <span>{text("Choose the display language for this browser.")}</span>
        </p>
      </div>
      <Select
        value={language}
        onValueChange={(value) => setLanguage(uiLanguageFromCookie(value))}
      >
        <SelectTrigger aria-labelledby="ui-language-heading">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {UI_LANGUAGES.map((option) => (
            <SelectItem key={option} value={option}>
              <span lang={option} translate="no">
                {NATIVE_LABELS[option]}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
