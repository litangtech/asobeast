"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import Link from "next/link";
import { formatCheckedPosition } from "@asobeast/shared";
import { Button } from "@/components/ui/button";
import { CHART_HEIGHT } from "./theme";
import { formatCountry } from "@/lib/format";
import { cn } from "@/lib/utils";
import { lastCheckedIndex, NOT_CHECKED, type RankingChartData } from "./pivot";

function Frame({
  title,
  body,
  action,
  children,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 text-center",
        CHART_HEIGHT.hero,
      )}
    >
      <p className="text-body font-medium">{title}</p>
      <p className="max-w-md text-caption text-muted-foreground">{body}</p>
      {children}
      {action}
    </div>
  );
}

export function NoKeywordsTracked({ id }: { id: string }) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Frame
      title={uiLabel("No keywords tracked yet")}
      body="Ranking history is drawn from the keywords you track for this app."
      action={
        <Button asChild size="sm" className="print:hidden">
          <Link href={`/apps/${id}/keywords`}>
            <UiText message="Go to keywords" />
          </Link>
        </Button>
      }
    />
  );
}

export function NoKeywordsInMarket({
  id,
  country,
  action,
}: {
  id: string;
  country: string;
  action?: React.ReactNode;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Frame
      title={uiLabel("No keywords tracked in {0} yet", [
        formatCountry(country),
      ])}
      body="Track keywords for this market to follow their positions here."
      action={
        action === undefined ? (
          <Button asChild size="sm" className="print:hidden">
            <Link href={`/apps/${id}/keywords?country=${country}`}>
              <UiText message="Go to keywords" />
            </Link>
          </Button>
        ) : (
          action
        )
      }
    />
  );
}

export function NoPositionsYet() {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Frame
      title={uiLabel("No positions captured yet")}
      body="The daily pipeline checks each tracked keyword and the first points appear within 24 hours of import."
    />
  );
}

export function NoDataInRange({ onWiden }: { onWiden?: () => void }) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Frame
      title={uiLabel("Nothing captured in this range")}
      body="These keywords have history outside the selected window."
      action={
        onWiden ? (
          <Button
            size="sm"
            variant="outline"
            className="print:hidden"
            onClick={onWiden}
          >
            <UiText message="Widen to 90 days" />
          </Button>
        ) : null
      }
    />
  );
}

export function InsufficientHistory({ data }: { data: RankingChartData }) {
  const { text: uiLabel } = useUiLanguage();
  const lastIndex = lastCheckedIndex(data);
  const row = data.rows[lastIndex];
  const depths = data.depths[lastIndex];

  return (
    <Frame
      title={uiLabel("Not enough history for a trend")}
      body="A line needs at least four daily checks. These are the latest captured positions."
    >
      <dl className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {data.keywordIds.map((keywordId) => {
          const value = row?.[keywordId];
          return (
            <div key={keywordId} className="flex flex-col items-center">
              <dt className="max-w-40 truncate text-caption text-muted-foreground">
                {data.seriesLabels[keywordId] ?? keywordId}
              </dt>
              <dd className="numeric font-mono text-title">
                {formatCheckedPosition(
                  typeof value === "number" ? value : null,
                  depths?.[keywordId] ?? null,
                ) ?? NOT_CHECKED}
              </dd>
            </div>
          );
        })}
      </dl>
    </Frame>
  );
}
