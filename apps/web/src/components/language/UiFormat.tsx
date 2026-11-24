"use client";

import { uiCountry, uiDate, type UiDateStyle } from "@/lib/ui-formats";
import { useUiLanguage } from "./UiLanguage";

export function UiCountry({ code }: { code: string }) {
  const { language } = useUiLanguage();
  return <span>{uiCountry(language, code)}</span>;
}

export function UiDate({
  value,
  style = "date",
}: {
  value: string | null | undefined;
  style?: UiDateStyle;
}) {
  const { language } = useUiLanguage();
  return <span>{uiDate(language, value, style)}</span>;
}
