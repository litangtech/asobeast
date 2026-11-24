import type {
  ChangeImpactFunnel,
  ChangeImpactMovement,
  ChangeImpactWindow,
} from "@asobeast/shared";
import { formatConversion, formatCount } from "@/lib/funnel";
import { formatMeasure } from "@/lib/format";
import { uiDate } from "@/lib/ui-formats";
import { uiText, type UiLanguage } from "@/lib/ui-language";

const dateList = new Intl.ListFormat("en-US", { type: "conjunction" });

const plural = (count: number, noun: string): string =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

export function windowTitle(days: number, language: UiLanguage = "en"): string {
  return uiText(language, "After {0} days", [days]);
}

export function windowStatusLine(
  impact: Pick<ChangeImpactWindow, "status" | "targetDate" | "measuredOn">,
  language: UiLanguage = "en",
): string {
  if (impact.status === "pending") {
    return uiText(language, "Measurable on {0}", [
      uiDate(language, impact.targetDate, "date"),
    ]);
  }
  if (impact.status === "measured") {
    return uiText(language, "Measured on {0}", [
      uiDate(language, impact.measuredOn, "date"),
    ]);
  }
  return uiText(language, "No rank check near {0}", [
    uiDate(language, impact.targetDate, "date"),
  ]);
}

export function movementLine(
  movement: ChangeImpactMovement,
  language: UiLanguage = "en",
): string {
  return uiText(language, "{0} improved, {1} declined", [
    movement.improved,
    movement.declined,
  ]);
}

export function rankingShiftLine(
  movement: ChangeImpactMovement,
  language: UiLanguage = "en",
): string | null {
  const parts = [
    movement.entered > 0
      ? uiText(language, "{0} started ranking", [movement.entered])
      : null,
    movement.exited > 0
      ? uiText(language, "{0} stopped ranking", [movement.exited])
      : null,
  ].filter((part): part is string => part !== null);
  return parts.length === 0
    ? null
    : parts.join(language === "zh-CN" ? "，" : ", ");
}

export function measuredLine(
  movement: ChangeImpactMovement,
  language: UiLanguage = "en",
): string {
  return language === "zh-CN"
    ? uiText(language, "{0} keywords checked on both days", [movement.measured])
    : `${plural(movement.measured, "keyword")} checked on both days`;
}

export function visibilityRange(
  impact: Pick<ChangeImpactWindow, "visibilityBefore" | "visibilityAfter">,
): string | null {
  const { visibilityBefore: before, visibilityAfter: after } = impact;
  if (before === null || after === null) return null;
  return `${formatMeasure(before)} → ${formatMeasure(after)}`;
}

export function overlapNotice(
  dates: readonly string[],
  language: UiLanguage = "en",
): string | null {
  if (dates.length === 0) return null;
  const formatted = dates.map((date) => uiDate(language, date, "date"));
  const list =
    language === "zh-CN" ? formatted.join("、") : dateList.format(formatted);
  return dates.length === 1
    ? uiText(language, "Another change on {0} falls inside this window.", [
        list,
      ])
    : uiText(language, "Other changes on {0} fall inside this window.", [list]);
}

export function impactScopeLine(
  {
    days,
    totalChanges,
    shown,
  }: {
    days: number;
    totalChanges: number;
    shown: number;
  },
  language: UiLanguage = "en",
): string {
  if (language === "zh-CN" && shown === totalChanges)
    return uiText(
      language,
      "{0} changes to your listing in the last {1} days",
      [shown, days],
    );
  return shown === totalChanges
    ? `${plural(shown, "change")} to your listing in the last ${days} days`
    : uiText(
        language,
        "The {0} newest of {1} changes to your listing in the last {2} days",
        [shown, totalChanges, days],
      );
}

export interface FunnelRanges {
  gets: string;
  conversion: string;
}

export function funnelRanges(
  funnel: ChangeImpactFunnel | null | undefined,
): FunnelRanges | null {
  if (funnel?.status !== "measured" || !funnel.before || !funnel.after) {
    return null;
  }
  return {
    gets: `${formatCount(funnel.before.gets)} → ${formatCount(funnel.after.gets)}`,
    conversion: `${formatConversion(funnel.before.conversion)} → ${formatConversion(funnel.after.conversion)}`,
  };
}

export function funnelNote(
  funnel: ChangeImpactFunnel | null | undefined,
  days: number,
  language: UiLanguage = "en",
): string | null {
  if (!funnel || funnel.status === "measured") return null;
  if (funnel.status === "unmeasured") {
    return uiText(language, "No console data before this change");
  }
  if (funnel.finalOn) {
    return uiText(
      language,
      "The console's numbers for this window are final by {0}",
      [uiDate(language, funnel.finalOn, "date")],
    );
  }
  const remaining = days - funnel.completeDays;
  return language === "zh-CN"
    ? uiText(
        language,
        "The console's numbers for this window are final in {0} days",
        [remaining],
      )
    : `The console's numbers for this window are final in ${plural(remaining, "day")}`;
}
