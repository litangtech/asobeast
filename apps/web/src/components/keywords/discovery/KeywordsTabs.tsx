"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsOption } from "@/components/ui/tabs";
import { keywordDiscoveriesOptions, keywordsOptions } from "@/lib/queries";
import {
  discoveryStateParser,
  keywordsTabParser,
  type KeywordsTab,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";

const TAB_PARAMS = {
  tab: keywordsTabParser.withOptions({ history: "push" }),
  state: discoveryStateParser,
};

export function useKeywordsTab() {
  const [{ tab }, setParams] = useQueryStates(TAB_PARAMS);
  const setTab = (next: KeywordsTab) =>
    void setParams({ tab: next === "tracked" ? null : next, state: null });
  return [tab, setTab] as const;
}

export function KeywordsTabs({ id, market }: { id: string; market: string }) {
  const { text: uiLabel } = useUiLanguage();
  const [tab, setTab] = useKeywordsTab();
  const { data: tracked } = useQuery(keywordsOptions(id, market));
  const { data: discovered } = useQuery(keywordDiscoveriesOptions(id, market));
  const discoveredLabel = discovered?.counts
    ? uiLabel("Discovered {0}", [discovered.counts.all])
    : uiLabel("Discovered");
  const unseen = tab !== "discovered" && (discovered?.counts.all ?? 0) > 0;

  return (
    <Tabs
      value={tab}
      onValueChange={(next) => setTab(keywordsTabParser.parse(next) ?? tab)}
      className="max-w-full min-w-0"
    >
      <TabsList aria-label={uiLabel("Keyword lists")} scrollable>
        <TabsOption value="tracked">
          {tracked ? (
            <UiText message="Tracked {0}" values={[tracked.length]} />
          ) : (
            <UiText message="Tracked" />
          )}
        </TabsOption>
        <TabsOption
          value="discovered"
          aria-label={
            unseen
              ? uiLabel("{0}, new discoveries to review", [discoveredLabel])
              : undefined
          }
        >
          <span>{discoveredLabel}</span>
          <span
            aria-hidden
            className={cn(
              "size-1.5 rounded-full bg-info",
              unseen ? "visible" : "invisible",
            )}
          />
        </TabsOption>
      </TabsList>
    </Tabs>
  );
}
