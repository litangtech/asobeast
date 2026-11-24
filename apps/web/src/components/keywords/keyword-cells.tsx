"use client";

import { UiDate } from "@/components/language/UiFormat";
import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { createContext, useContext } from "react";
import { ChartLine, LoaderCircle, StickyNote } from "lucide-react";
import type { PlayAcquisitions, TrackedKeywordItem } from "@asobeast/shared";
import { formatCheckedPosition } from "@asobeast/shared";
import { MatchedText } from "@/components/keyword-match/MatchedText";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatMonth, formatNumber, pluralize } from "@/lib/format";
import { isChecking, lostPosition, staleCheckDay } from "@/lib/keyword-checks";
import { tagsLabel, visibleTags } from "@/lib/keyword-tags";
import { RankRecheckStatus } from "./RankRecheckStatus";
import { PositionReadout } from "./PositionReadout";
import {
  PositionHistoryPopover,
  type PositionHistoryContext,
} from "./PositionHistoryPopover";
import { cn } from "@/lib/utils";
import { KeywordClassBadge } from "./KeywordClassBadge";

function volatilityBand(value: number): {
  label: string;
  text: string;
  dot: string;
} {
  if (value < 20) {
    return {
      label: "Low",
      text: "text-muted-foreground",
      dot: "bg-muted-foreground/60",
    };
  }
  if (value <= 50) {
    return {
      label: "Medium",
      text: "text-warning",
      dot: "bg-warning",
    };
  }
  return {
    label: "High",
    text: "text-signal-down",
    dot: "bg-signal-down",
  };
}

export function PositionCell({
  keyword,
  today,
  history,
}: {
  keyword: TrackedKeywordItem;
  today: string;
  history: PositionHistoryContext;
}) {
  const { text: uiLabel } = useUiLanguage();
  const label = formatCheckedPosition(
    keyword.latestPosition,
    keyword.latestDepth,
  );
  if (label === null && keyword.rankRecheckPending) {
    return <RankRecheckStatus keyword={keyword} />;
  }
  if (label === null && isChecking(keyword)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label={uiLabel("Position: checking")}
            className="inline-flex items-center gap-1.5 text-muted-foreground"
          >
            <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
            <UiText message="Checking…" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <UiText message="Queued for its first check. Scores can land first; the table updates on its own." />
        </TooltipContent>
      </Tooltip>
    );
  }
  if (label === null) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label={uiLabel("Position: not checked yet")}
            className="text-muted-foreground"
          >
            —
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <UiText message="This keyword has not been checked yet" />
        </TooltipContent>
      </Tooltip>
    );
  }
  const staleOn = staleCheckDay(keyword, today);
  return (
    <span className="inline-flex items-center gap-1">
      {keyword.rankRecheckPending ? (
        <RankRecheckStatus keyword={keyword} />
      ) : (
        <PositionReadout
          keyword={keyword}
          label={label}
          staleOn={staleOn}
          lost={lostPosition(keyword)}
        />
      )}
      <PositionHistoryPopover
        keyword={keyword}
        label={label}
        staleOn={staleOn}
        {...history}
      />
    </span>
  );
}

export function VolatilityCell({ value }: { value: number | null }) {
  const { text: uiLabel } = useUiLanguage();
  if (value === null) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-muted-foreground">—</span>
        </TooltipTrigger>
        <TooltipContent>
          <UiText message="Not enough snapshots yet" />
        </TooltipContent>
      </Tooltip>
    );
  }
  const band = volatilityBand(value);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        band.text,
      )}
      aria-label={uiLabel("{0} volatility, {1} out of 100", [
        band.label,
        value,
      ])}
    >
      <span className={cn("size-2 rounded-full", band.dot)} aria-hidden />
      <UiText message={band.label} />
      <span className="numeric font-mono text-xs text-muted-foreground">
        {value}
      </span>
    </span>
  );
}

export function PlayAcquisitionsCell({
  value,
}: {
  value: PlayAcquisitions | null;
}) {
  const { text: uiLabel } = useUiLanguage();
  if (!value) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="text-muted-foreground"
            aria-label={uiLabel("No Play Console data")}
          >
            —
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <UiText message="No Play Console data" />
        </TooltipContent>
      </Tooltip>
    );
  }
  const month = formatMonth(value.month);
  const acquisitions = formatNumber(value.acquisitions);
  const visitors = formatNumber(value.visitors);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="numeric font-mono text-sm whitespace-nowrap"
          aria-label={uiLabel(
            "{0} acquisitions from {1} store listing visitors in {2}",
            [acquisitions, visitors, month],
          )}
        >
          <span>{acquisitions}</span>
          <span className="text-muted-foreground">{` · ${visitors}`}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <UiText
          message="Store listing acquisitions and visitors from this search term in {0}"
          values={[month]}
        />
      </TooltipContent>
    </Tooltip>
  );
}

export function TagBadges({ tags }: { tags: readonly string[] }) {
  if (tags.length === 0) return null;
  const { shown, hidden } = visibleTags(tags);
  const label = tagsLabel(tags);
  return (
    <span
      role="group"
      aria-label={label}
      title={label}
      className="flex items-center gap-1 whitespace-nowrap"
    >
      {shown.map((tag) => (
        <Badge key={tag} variant="outline" aria-hidden>
          {tag}
        </Badge>
      ))}
      {hidden > 0 ? (
        <span aria-hidden className="text-caption text-muted-foreground">
          {`+${hidden}`}
        </span>
      ) : null}
    </span>
  );
}

export function NoteButton({ note }: { note: string }) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={uiLabel("Note: {0}", [note])}
          className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:text-foreground"
        >
          <StickyNote className="size-3.5" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label={uiLabel("Keyword note")}
        className="w-auto max-w-[min(24rem,calc(100vw-2rem))] font-normal break-words whitespace-pre-line"
      >
        {note}
      </PopoverContent>
    </Popover>
  );
}

export const ListingMarksContext = createContext(true);

export const ChartedKeywordsContext = createContext<ReadonlySet<string>>(
  new Set(),
);

export function KeywordCell({ keyword }: { keyword: TrackedKeywordItem }) {
  const marks = useContext(ListingMarksContext);
  const onChart = useContext(ChartedKeywordsContext).has(keyword.keywordId);
  return (
    <span className="flex max-w-40 items-center gap-2 font-medium md:max-w-64">
      <span title={keyword.text} className="truncate">
        <MatchedText
          segments={marks ? keyword.matchedIn : null}
          fallback={keyword.text}
        />
        {onChart ? (
          <span className="sr-only">
            <UiText message=", on the chart" />
          </span>
        ) : null}
      </span>
      {onChart ? (
        <ChartLine
          aria-hidden
          className="size-3.5 shrink-0 text-muted-foreground"
        />
      ) : null}
      <KeywordClassBadge
        keywordClass={keyword.keywordClass}
        source={keyword.keywordClassSource}
      />
      {keyword.note ? <NoteButton note={keyword.note} /> : null}
      {!keyword.active ? (
        <Badge variant="secondary" className="shrink-0">
          <UiText message="Paused" />
        </Badge>
      ) : null}
    </span>
  );
}

export function AddedCell({ trackedAt }: { trackedAt: string | null }) {
  const { text: uiLabel } = useUiLanguage();
  if (trackedAt === null) {
    return (
      <span
        className="text-muted-foreground"
        aria-label={uiLabel("Added: unknown")}
      >
        —
      </span>
    );
  }
  return (
    <time dateTime={trackedAt} className="numeric text-sm whitespace-nowrap">
      <UiDate value={trackedAt} />
    </time>
  );
}

export function CompetitorsInTop10Cell({ value }: { value: number | null }) {
  const { text: uiLabel } = useUiLanguage();
  if (value === null) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="text-muted-foreground"
            aria-label={uiLabel("Competitors in top 10: not available")}
          >
            —
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <UiText message="No competitors tracked, or no top 10 snapshot from today or yesterday" />
        </TooltipContent>
      </Tooltip>
    );
  }
  return (
    <span
      className="numeric font-mono text-sm"
      aria-label={uiLabel("{0} in the top 10", [
        pluralize(value, "competitor"),
      ])}
    >
      {value}
    </span>
  );
}
