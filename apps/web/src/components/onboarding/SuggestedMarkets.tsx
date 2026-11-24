"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  type MarketSuggestion,
  type MarketSuggestionsResult,
  type Store,
} from "@asobeast/shared";
import { ReadRoleBadge } from "@/components/localizations/ReadRoleBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoTip } from "@/components/ui/info-tip";
import { Label } from "@/components/ui/label";
import { formatCountry, formatList } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  seedChosen,
  seedStatusText,
  seedButtonLabel,
  seedPlan,
  type SeedOutcome,
} from "./market-seeding";
import {
  groupSuggestions,
  languageNames,
  MARKET_COST_GUIDE,
  marketCostSummary,
  marketCostText,
} from "./market-suggestions";
import { useMarketSeeding } from "./useMarketSeeding";

const toggled = (
  set: ReadonlySet<string>,
  market: string,
  on: boolean,
): Set<string> => {
  const next = new Set(set);
  if (on) next.add(market);
  else next.delete(market);
  return next;
};

export function SuggestedMarkets({
  appId,
  store,
  result,
  selected,
  onSelect,
}: {
  appId: string;
  store: Store;
  result: MarketSuggestionsResult;
  selected: readonly string[];
  onSelect: (market: string, selected: boolean) => void;
}) {
  const languages = languageNames(result);
  const [ticked, setTicked] = useState<ReadonlySet<string>>(new Set());
  const [seedChoices, setSeedChoices] = useState<ReadonlyMap<string, boolean>>(
    new Map(),
  );
  const { outcomes, run, seeding } = useMarketSeeding(appId, onSelect);
  const pending = result.suggestions
    .map((suggestion) => suggestion.country)
    .filter((country) => ticked.has(country));
  const plan = seedPlan(
    pending,
    new Set(
      result.suggestions
        .filter((suggestion) => seedChosen(suggestion, seedChoices))
        .map((suggestion) => suggestion.country),
    ),
  );
  const pick = (market: MarketSuggestion, on: boolean) => {
    if (selected.includes(market.country)) {
      if (!on) onSelect(market.country, false);
      return;
    }
    setTicked((current) => toggled(current, market.country, on));
  };
  const add = () => {
    for (const market of plan.select) onSelect(market, true);
    setTicked(new Set());
    run(plan);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-body">
          <UiText message="Your listing ships" trailing />
          {formatList(languages)}.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((language) => (
            <Badge key={language} variant="secondary">
              {language}
            </Badge>
          ))}
        </div>
      </div>
      {groupSuggestions(result).map((group) => (
        <fieldset key={group.localization} className="flex flex-col gap-2">
          <legend className="mb-1 text-body font-medium">{group.name}</legend>
          {group.markets.map((market) => (
            <SuggestedMarket
              key={market.country}
              market={market}
              selected={selected.includes(market.country)}
              ticked={ticked.has(market.country)}
              seed={seedChosen(market, seedChoices)}
              seeding={seeding.includes(market.country)}
              outcome={outcomes[market.country]}
              onPick={(on) => pick(market, on)}
              onSeed={(on) =>
                setSeedChoices((current) =>
                  new Map(current).set(market.country, on),
                )
              }
            />
          ))}
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          disabled={pending.length === 0 || seeding.length > 0}
          onClick={add}
        >
          {seeding.length > 0 ? <Loader2 className="animate-spin" /> : null}
          {seedButtonLabel(pending.length, plan.seed.length)}
        </Button>
        <p className="flex items-center gap-1 text-caption text-muted-foreground">
          <UiText message="Each country adds requests a day to the daily run." />
          <MarketCostTip store={store} />
        </p>
      </div>
    </div>
  );
}

export function MarketCostTip({ store }: { store: Store }) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <InfoTip
      label={uiLabel("About market costs")}
      title={uiLabel("What a market costs")}
      summary={marketCostSummary(store)}
    >
      <a
        href={MARKET_COST_GUIDE}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-foreground underline decoration-primary underline-offset-4 hover:decoration-2"
      >
        <UiText message="Read what a market costs" />
      </a>
    </InfoTip>
  );
}

function SuggestedMarket({
  market,
  selected,
  ticked,
  seed,
  seeding,
  outcome,
  onPick,
  onSeed,
}: {
  market: MarketSuggestion;
  selected: boolean;
  ticked: boolean;
  seed: boolean;
  seeding: boolean;
  outcome: SeedOutcome | undefined;
  onPick: (on: boolean) => void;
  onSeed: (on: boolean) => void;
}) {
  const id = `setup-suggested-${market.country}`;
  const seedId = `setup-seed-${market.country}`;
  const name = formatCountry(market.country);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Checkbox
          id={id}
          checked={market.tracked || selected || ticked}
          disabled={market.tracked || seeding}
          onCheckedChange={(value) => onPick(value === true)}
        />
        <Label htmlFor={id} className="min-w-0">
          {name} ({market.country.toUpperCase()})
        </Label>
        <ReadRoleBadge role={market.role} />
        {market.tracked ? (
          <Badge variant="outline">
            <UiText message="Tracked" />
          </Badge>
        ) : null}
        <span className="text-caption text-muted-foreground">
          {marketCostText(market)}
        </span>
      </div>
      {ticked ? (
        <div className="flex items-center gap-2 pl-6">
          <Checkbox
            id={seedId}
            checked={seed}
            onCheckedChange={(value) => onSeed(value === true)}
          />
          <Label
            htmlFor={seedId}
            className="text-caption font-normal text-muted-foreground"
          >
            <UiText message="Seed with its listing" />
            <span className="sr-only">
              <UiText message="for {0}" values={[name]} leading />
            </span>
          </Label>
        </div>
      ) : null}
      <p
        role="status"
        className={cn(
          "pl-6 text-caption empty:hidden",
          outcome?.kind === "failed"
            ? "text-destructive"
            : "text-muted-foreground",
        )}
      >
        {seedStatusText(seeding, outcome)}
      </p>
    </div>
  );
}
