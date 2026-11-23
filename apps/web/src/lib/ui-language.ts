import { SIMPLIFIED_CHINESE } from "./ui-messages.zh-cn";

export const UI_LANGUAGE_COOKIE = "asobeast_language";
export const UI_LANGUAGE_MAX_AGE = 60 * 60 * 24 * 365;
export const UI_LANGUAGES = ["en", "zh-CN"] as const;

export type UiLanguage = (typeof UI_LANGUAGES)[number];

export function uiLanguageFromCookie(value: string | undefined): UiLanguage {
  return value === "zh-CN" ? "zh-CN" : "en";
}

export function uiText(language: UiLanguage, message: string): string {
  return language === "zh-CN" && Object.hasOwn(SIMPLIFIED_CHINESE, message)
    ? SIMPLIFIED_CHINESE[message]
    : message;
}
