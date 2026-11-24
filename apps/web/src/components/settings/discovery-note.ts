import type { DiscoveryBudget } from "@asobeast/shared";
import { pluralize } from "@/lib/format";
import { uiText, type UiLanguage } from "@/lib/ui-language";

export function discoveryNote(
  discovery: DiscoveryBudget | undefined,
  language: UiLanguage = "en",
): string | null {
  if (!discovery || discovery.checksPerWeek === 0) return null;
  if (language === "zh-CN")
    return uiText(
      language,
      "Keyword discovery adds up to {0} searches per week, about {1} requests, outside the daily total.",
      [discovery.checksPerWeek, discovery.requestsPerWeek],
    );
  return `Keyword discovery adds up to ${pluralize(discovery.checksPerWeek, "search", "searches")} a week, about ${pluralize(discovery.requestsPerWeek, "request")}, outside this daily total.`;
}
