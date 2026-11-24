import {
  formatCountry,
  formatDate,
  formatDateTime,
  formatDayMonth,
  formatMonth,
  formatUtcClock,
} from "./format";
import { CHINESE_REGIONS } from "./ui-copy/regions.zh-cn";
import type { UiLanguage } from "./ui-language";

const ENGLISH_DATES = {
  date: formatDate,
  dateTime: formatDateTime,
  dayMonth: formatDayMonth,
  month: formatMonth,
  clock: formatUtcClock,
};

export type UiDateStyle = keyof typeof ENGLISH_DATES;

export function uiCountry(language: UiLanguage, code: string): string {
  return language === "zh-CN"
    ? (CHINESE_REGIONS[code.toLowerCase()] ?? formatCountry(code))
    : formatCountry(code);
}

export function uiDate(
  language: UiLanguage,
  value: string | null | undefined,
  style: UiDateStyle,
): string {
  if (!value) return "—";
  if (language === "en") return ENGLISH_DATES[style](value);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const datePart = `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
  const clock = [date.getUTCHours(), date.getUTCMinutes()]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");

  switch (style) {
    case "date":
      return datePart;
    case "dateTime":
      return `${datePart} ${clock} UTC`;
    case "dayMonth":
      return `${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
    case "month":
      return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月`;
    case "clock":
      return `${clock} UTC`;
  }
}
