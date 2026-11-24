import type { BudgetCompletion } from "@asobeast/shared";
import { pluralize } from "@/lib/format";
import { uiDate } from "@/lib/ui-formats";
import { uiText, type UiLanguage } from "@/lib/ui-language";

const MINUTES_PER_HOUR = 60;

export function budgetCompletionSentence(
  { startsAt, completesAt, hours }: BudgetCompletion,
  totalRequests: number,
  language: UiLanguage = "en",
): string | null {
  if (startsAt === null) return null;

  const starts = uiText(language, "The next run starts {0}", [
    uiDate(language, startsAt, "dateTime"),
  ]);
  if (totalRequests === 0)
    return uiText(language, "{0} and has nothing to collect yet.", [starts]);
  if (completesAt === null || hours === null)
    return uiText(language, "{0}.", [starts]);
  if (hours * MINUTES_PER_HOUR < 1)
    return uiText(language, "{0} and is expected to finish within a minute.", [
      starts,
    ]);

  const end = uiDate(language, completesAt, "dateTime");
  return language === "zh-CN"
    ? uiText(
        language,
        "{0} and is expected to finish around {1}, after about {2} hours of collection.",
        [starts, end, hours],
      )
    : `${starts} and is expected to finish around ${end}, after about ${pluralize(hours, "hour")} of collection.`;
}
