import { uiText, type UiLanguage } from "./ui-language";
import type { AppScreenshots, ScreenshotCaptionStatus } from "@asobeast/shared";
import { PRODUCT_NAME } from "./brand";

export const CAPTION_STATUS_LABELS: Record<ScreenshotCaptionStatus, string> = {
  pending: "Reading",
  read: "Caption read",
  blank: "No caption",
  failed: "Could not read",
  skipped: "Not read",
};

export const SCREENSHOT_POLL_MS = 5_000;

export function hasPendingScreenshots(
  data: AppScreenshots | undefined,
): boolean {
  return data?.screenshots.some((item) => item.status === "pending") ?? false;
}

export function screenshotSummary(
  data: AppScreenshots,
  language: UiLanguage = "en",
): string {
  if (data.reading === "unsupported") {
    return uiText(
      language,
      "Google Play does not index screenshot text, so {0} does not read it.",
      [PRODUCT_NAME],
    );
  }
  if (data.reading === "off") {
    return uiText(
      language,
      "Reading screenshot text is switched off on this instance.",
    );
  }
  const total = data.screenshots.length;
  if (total === 0) {
    return uiText(
      language,
      "No screenshots recorded yet. Refresh the app to capture them.",
    );
  }
  const settled = data.screenshots.filter(
    (item) => item.status !== "pending",
  ).length;
  if (settled < total) {
    return uiText(
      language,
      "Reading {0} of {1} screenshots. This page updates when they are done.",
      [settled, total],
    );
  }
  const read = data.screenshots.filter((item) => item.caption !== null).length;
  return uiText(language, "{0} of {1} screenshots carry a caption.", [
    read,
    total,
  ]);
}
