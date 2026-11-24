"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChartScatter, Plus, TableProperties, X } from "lucide-react";
import { useQueryState } from "nuqs";
import type { Store, TrackedKeywordItem } from "@asobeast/shared";
import { Button } from "@/components/ui/button";
import { MarketPills } from "@/components/layout/MarketPills";
import { Tabs, TabsList, TabsOption } from "@/components/ui/tabs";
import { keywordCountriesOptions, keywordsOptions } from "@/lib/queries";
import { countryParser, keywordViewParser } from "@/lib/search-params";
import { AddKeywordsDialog } from "./AddKeywordsDialog";

export function KeywordsToolbar({
  id,
  store,
  market,
  homeCountry,
  showTrackedControls = true,
}: {
  id: string;
  store: Store;
  market: string;
  homeCountry: string;
  showTrackedControls?: boolean;
}) {
  const { text: uiLabel } = useUiLanguage();
  const [, setCountry] = useQueryState("country", countryParser);
  const { data: markets } = useSuspenseQuery(keywordCountriesOptions(id));
  const { data: keywords } = useSuspenseQuery(keywordsOptions(id, market));

  const total = markets.reduce((sum, entry) => sum + entry.keywordCount, 0);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <MarketPills
          markets={markets.map((entry) => ({
            country: entry.country,
            count: entry.keywordCount,
          }))}
          value={market}
          onChange={(next) => {
            if (next) void setCountry(next);
          }}
          ariaLabel={uiLabel("Keyword markets")}
        />
        <AddKeywordsDialog appId={id} store={store} country={market}>
          <Button
            variant="outline"
            size="sm"
            aria-label={uiLabel("Add a market")}
          >
            <Plus />
          </Button>
        </AddKeywordsDialog>
      </div>

      {market !== homeCountry ? (
        <button
          type="button"
          onClick={() => void setCountry(null)}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-caption hover:bg-muted"
        >
          <span>
            <UiText message="Market: {0}" values={[market.toUpperCase()]} />
          </span>
          <X className="size-3 opacity-60" aria-hidden />
          <span className="sr-only">
            <UiText message="Clear the market filter" />
          </span>
        </button>
      ) : null}

      {showTrackedControls ? (
        <TrackedSummary keywords={keywords} total={total} />
      ) : null}
      {showTrackedControls ? <KeywordViewSwitch /> : null}
    </div>
  );
}

function TrackedSummary({
  keywords,
  total,
}: {
  keywords: TrackedKeywordItem[];
  total: number;
}) {
  const active = keywords.filter((keyword) => keyword.active).length;
  const partial = keywords.length !== total;
  return (
    <p className="text-body text-muted-foreground" aria-live="polite">
      <UiText message="Tracking" />{" "}
      <span className="numeric font-mono font-medium text-foreground">
        {keywords.length}
      </span>
      {partial ? (
        <span>
          <UiText message=" of " />
          <span className="numeric font-mono font-medium text-foreground">
            {total}
          </span>
        </span>
      ) : null}
      <span>
        <UiText
          message=" keyword{0} · "
          values={[keywords.length === 1 ? "" : "s"]}
        />
      </span>
      <span className="numeric font-mono font-medium text-foreground">
        {active}
      </span>{" "}
      <UiText message="active" />
    </p>
  );
}

function KeywordViewSwitch() {
  const { text: uiLabel } = useUiLanguage();
  const [view, setView] = useQueryState("view", keywordViewParser);
  return (
    <Tabs
      value={view}
      onValueChange={(next) =>
        void setView(keywordViewParser.parse(next) ?? view)
      }
      className="ml-auto"
    >
      <TabsList aria-label={uiLabel("Keyword view")}>
        <TabsOption value="table">
          <TableProperties aria-hidden />
          <span>
            <UiText message="Table" />
          </span>
        </TabsOption>
        <TabsOption value="map">
          <ChartScatter aria-hidden />
          <span>
            <UiText message="Map" />
          </span>
        </TabsOption>
      </TabsList>
    </Tabs>
  );
}
