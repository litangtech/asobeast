import type {
  ActionActivity,
  ActionItem,
  ActionSummary,
} from "@asobeast/shared";
import { formatNumber } from "@/lib/format";
import { uiDate } from "@/lib/ui-formats";
import { uiText, type UiLanguage } from "@/lib/ui-language";

export interface OverviewTile {
  label: string;
  value: string;
  note: string;
}

const WEEK_DAYS = 7;
const NOT_GENERATED = "not generated yet";

function openNote(summary: ActionSummary, language: UiLanguage): string {
  const { critical, high } = summary.openByPriority;
  if (summary.open === 0) return uiText(language, "nothing open");
  if (critical === 0 && high === 0)
    return uiText(language, "all medium or low");
  return uiText(language, "{0} critical · {1} high", [
    formatNumber(critical),
    formatNumber(high),
  ]);
}

function nextWake(items: readonly ActionItem[], language: UiLanguage): string {
  const dates = items
    .map((item) => item.snoozedUntil)
    .filter((date): date is string => date !== null)
    .sort();
  return dates.length > 0
    ? uiText(language, "next wakes {0}", [uiDate(language, dates[0], "date")])
    : uiText(language, "none");
}

export function overviewTiles(
  summary: ActionSummary,
  activity: ActionActivity,
  todo: readonly ActionItem[],
  language: UiLanguage = "en",
): OverviewTile[] {
  const week = activity.days.slice(-WEEK_DAYS);
  const tiles: OverviewTile[] = [
    {
      label: "Open",
      value: formatNumber(
        Object.values(summary.openByPriority).reduce((sum, n) => sum + n, 0),
      ),
      note: openNote(summary, language),
    },
    {
      label: "New this week",
      value: formatNumber(
        week.reduce((sum, day) => sum + day.opened + day.reopened, 0),
      ),
      note: uiText(language, "{0} resolved on their own", [
        formatNumber(week.reduce((sum, day) => sum + day.resolved, 0)),
      ]),
    },
    {
      label: "Confirmed fixed",
      value: formatNumber(activity.totals.verified),
      note: uiText(language, "{0} marked done · {1} days", [
        formatNumber(activity.totals.done),
        activity.days.length,
      ]),
    },
    {
      label: "Snoozed",
      value: formatNumber(summary.snoozed),
      note: nextWake(
        todo.filter((item) => item.status === "SNOOZED"),
        language,
      ),
    },
  ];
  return tiles.map((tile) => ({
    ...tile,
    label: uiText(language, tile.label),
    ...(summary.generatedAt === null && {
      value: "—",
      note: uiText(language, NOT_GENERATED),
    }),
  }));
}
