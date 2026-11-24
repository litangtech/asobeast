"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import type { ReactNode } from "react";
import { MovementCell } from "@/components/movement/MovementCell";
import { Button } from "@/components/ui/button";
import { InfoTip } from "@/components/ui/info-tip";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact, formatDayMonth, formatRating } from "@/lib/format";
import type {
  PositionSummary,
  RatingSummary,
  SerpSummaryFacts,
  TitleSummary,
} from "./serp-summary";
import { serpRowId } from "./SerpRow";

const SEARCH_RESULTS_GUIDE =
  "https://docs.asobeast.com/guides/read-rankings#search-results";

function jumpToRow(position: number) {
  const row = document.getElementById(serpRowId(position));
  if (!row) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  row.scrollIntoView({
    block: "center",
    behavior: reduced ? "auto" : "smooth",
  });
  row.focus({ preventScroll: true });
}

function GuideLink() {
  return (
    <a
      href={SEARCH_RESULTS_GUIDE}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-primary underline-offset-4 hover:decoration-2"
    >
      <UiText message="Read about search results" />
    </a>
  );
}

function Item({
  label,
  tip,
  children,
}: {
  label: string;
  tip?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 bg-card p-3">
      <dt className="flex items-center gap-1 text-caption text-muted-foreground">
        <span>
          <UiText message={label} />
        </span>
        {tip}
      </dt>
      <dd className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        {children}
      </dd>
    </div>
  );
}

const Value = ({ children }: { children: ReactNode }) => (
  <span className="numeric font-mono text-base font-medium">{children}</span>
);

const Note = ({ children }: { children: ReactNode }) => (
  <span className="text-caption text-muted-foreground">{children}</span>
);

function PositionValue({
  position,
  comparedTo,
}: {
  position: PositionSummary;
  comparedTo: string | null;
}) {
  const { text: uiLabel } = useUiLanguage();
  switch (position.kind) {
    case "listed":
      return (
        <>
          <Button
            variant="link"
            className="h-auto p-0 numeric font-mono text-base font-medium"
            aria-label={uiLabel("Jump to your row at #{0}", [
              position.position,
            ])}
            onClick={() => jumpToRow(position.position)}
          >
            #{position.position}
          </Button>
          <span className="text-caption">
            <MovementCell
              entry={position.moved}
              period={comparedTo ? `since ${formatDayMonth(comparedTo)}` : ""}
              noneText="No earlier position"
              compact
            />
          </span>
        </>
      );
    case "deeper":
      return (
        <>
          <Value>{`#${position.position}`}</Value>
          <Note>
            <UiText message="below the top {0}" values={[position.listed]} />
          </Note>
        </>
      );
    case "notFound":
      return (
        <Note>
          <UiText message="Not in the top {0}" values={[position.depth]} />
        </Note>
      );
    default:
      return (
        <Note>
          <UiText message="Not in this list" />
        </Note>
      );
  }
}

function TitlesValue({ titles }: { titles: TitleSummary | null }) {
  if (!titles)
    return (
      <Note>
        <UiText message="Not reported" />
      </Note>
    );
  return (
    <Value>
      <UiText message="{0} of {1}" values={[titles.withKeyword, titles.of]} />
    </Value>
  );
}

function RatingsValue({ ratings }: { ratings: RatingSummary }) {
  if (ratings.kind === "median") {
    return (
      <>
        <Value>{formatCompact(ratings.value)}</Value>
        <Note>
          <UiText message="median" />
        </Note>
      </>
    );
  }
  if (ratings.kind === "average") {
    return (
      <>
        <Value>{formatRating(ratings.value)}</Value>
        <Note>
          <UiText message="average" />
        </Note>
      </>
    );
  }
  return (
    <Note>
      <UiText message="No ratings" />
    </Note>
  );
}

function SummaryGrid({
  position,
  titles,
  ratings,
  tips,
}: {
  position: ReactNode;
  titles: ReactNode;
  ratings: ReactNode;
  tips: boolean;
}) {
  const { text: uiLabel } = useUiLanguage();
  const tip = (tipLabel: string, title: string, summary: string) =>
    tips ? (
      <InfoTip label={tipLabel} title={title} summary={summary}>
        <GuideLink />
      </InfoTip>
    ) : (
      <span className="-my-1 size-6" />
    );
  return (
    <dl
      data-slot="serp-summary"
      className="mx-4 mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-lg border bg-border"
    >
      <Item label={uiLabel("Your position")}>{position}</Item>
      <Item
        label={uiLabel("Titles with it")}
        tip={tip(
          "About titles with the keyword",
          "Titles with the keyword",
          "How many of the top 10 titles hold the whole keyword, its words in order. Titles that hold only some of the words, or match only without accents, do not count.",
        )}
      >
        {titles}
      </Item>
      <Item
        label={uiLabel("Top 10 ratings")}
        tip={tip(
          "About top 10 ratings",
          "Top 10 ratings",
          "The median rating count of the top 10 apps, a rough measure of how established the top-ranked apps are. Google Play reports no counts, so its average rating shows instead.",
        )}
      >
        {ratings}
      </Item>
    </dl>
  );
}

export function SerpSummary({
  facts,
  comparedTo,
}: {
  facts: SerpSummaryFacts;
  comparedTo: string | null;
}) {
  return (
    <SummaryGrid
      tips
      position={
        <PositionValue position={facts.position} comparedTo={comparedTo} />
      }
      titles={<TitlesValue titles={facts.titles} />}
      ratings={<RatingsValue ratings={facts.ratings} />}
    />
  );
}

export function SerpSummarySkeleton() {
  const value = (
    <Skeleton className="w-16 border border-transparent text-transparent *:text-transparent">
      <Value>0</Value>{" "}
      <Note>
        <UiText message="median" />
      </Note>
    </Skeleton>
  );
  return (
    <SummaryGrid tips={false} position={value} titles={value} ratings={value} />
  );
}
