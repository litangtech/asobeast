"use client";

import { UiCountry } from "@/components/language/UiFormat";
import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { Suspense, useState, type FormEvent, type ReactNode } from "react";
import { ExternalLink, Plus, X } from "lucide-react";
import Link from "next/link";
import {
  SETUP_KEYWORD_TARGET,
  SETUP_STEPS,
  type CompetitorItem,
  type MarketSuggestionsResult,
  type SetupStep,
  type SetupStepState,
  type Store,
  type TrackedKeywordItem,
} from "@asobeast/shared";
import { CountrySelect } from "@/components/CountrySelect";
import { AddCompetitorForm } from "@/components/competitors/AddCompetitorForm";
import { COUNTRY_OPTIONS, marketError } from "@/lib/countries";
import { formatCountry, formatList } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscoveredApps } from "./DiscoveredApps";
import { KeywordPicker } from "./KeywordPicker";
import { FirstDiscoveries } from "./FirstDiscoveries";
import { activeKeywordCount, STEP_TITLES } from "./setup-progress";
import { MarketCostTip, SuggestedMarkets } from "./SuggestedMarkets";

const SKIP_REASON: Record<SetupStep, string> = {
  competitors:
    "Positions are compared against nobody until a competitor is added.",
  keywords: "Only the phrases from your listing are tracked.",
  countries: "Keywords are tracked in your home storefront only.",
};

export interface StepProps {
  state: SetupStepState;
  onSkip: (skipped: boolean) => void;
}

function StepCard({
  step,
  state,
  description,
  onSkip,
  children,
}: StepProps & {
  step: SetupStep;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card id={`setup-${step}`} className="scroll-mt-20">
      <CardHeader>
        <CardDescription>
          <UiText
            message="Step {0} of {1}"
            values={[SETUP_STEPS.indexOf(step) + 1, SETUP_STEPS.length]}
          />
        </CardDescription>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle asChild>
            <h3>
              <UiText message={STEP_TITLES[step]} />
            </h3>
          </CardTitle>
          <StepBadge state={state} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {children}
        <SkipAction step={step} state={state} onSkip={onSkip} />
      </CardContent>
    </Card>
  );
}

function StepBadge({ state }: { state: SetupStepState }) {
  if (state === "done")
    return (
      <Badge variant="success">
        <UiText message="Done" />
      </Badge>
    );
  if (state === "skipped")
    return (
      <Badge variant="outline">
        <UiText message="Skipped" />
      </Badge>
    );
  return null;
}

function SkipAction({ step, state, onSkip }: StepProps & { step: SetupStep }) {
  if (state === "skipped") {
    return (
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <UiText message="Skipped." trailing />
        <UiText message={SKIP_REASON[step]} />
        <Button
          variant="link"
          className="h-auto px-0"
          onClick={() => onSkip(false)}
        >
          <UiText message="Undo skip" />
        </Button>
      </p>
    );
  }
  if (state !== "open") return null;
  return (
    <Button
      variant="link"
      className="h-auto w-fit px-0"
      onClick={() => onSkip(true)}
    >
      <UiText message="Skip this step" />
    </Button>
  );
}

const competitorName = (competitor: CompetitorItem): string =>
  competitor.name ?? competitor.latestSnapshot?.title ?? "Unnamed app";

function competitorsLine(
  competitors: CompetitorItem[] | null,
  error: boolean,
): string {
  if (error) return "Competitor count is temporarily unavailable.";
  if (competitors === null) return "Loading competitors…";
  if (competitors.length === 0) return "No competitor yet";
  return `${competitors.length} tracked: ${formatList(competitors.map(competitorName))}`;
}

export function CompetitorsStep({
  appId,
  competitors,
  error,
  collecting,
  ...step
}: StepProps & {
  appId: string;
  competitors: CompetitorItem[] | null;
  error: boolean;
  collecting: boolean;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <StepCard
      step="competitors"
      description={uiLabel(
        "Track at least one app you compete with, so every keyword search compares you against it. Two or three is typical.",
      )}
      {...step}
    >
      <Suspense fallback={<Skeleton className="h-9 w-full" />}>
        <AddCompetitorForm id={appId} />
      </Suspense>
      <p className="text-sm text-muted-foreground">
        <UiText message={competitorsLine(competitors, error)} />
      </p>
      <DiscoveredApps appId={appId} collecting={collecting} />
      <Button asChild variant="link" className="h-auto w-fit px-0">
        <Link href={`/apps/${appId}/competitors`}>
          <UiText message="Manage competitors" />
        </Link>
      </Button>
    </StepCard>
  );
}

export interface MarketKeywordCount {
  market: string;
  active: number | null;
  error: boolean;
}

function homeKeywordsLine(
  tracked: TrackedKeywordItem[] | null,
  error: boolean,
  homeMarket: string,
): string {
  if (error) return "Keywords are temporarily unavailable.";
  if (tracked === null) return "Loading keywords…";
  const active = activeKeywordCount(tracked);
  const market = formatCountry(homeMarket);
  return active > SETUP_KEYWORD_TARGET
    ? `${active} tracked in ${market}`
    : `${active} of ${SETUP_KEYWORD_TARGET} tracked in ${market}`;
}

export function KeywordsStep({
  appId,
  store,
  homeMarket,
  tracked,
  error,
  counts,
  ...step
}: StepProps & {
  appId: string;
  store: Store;
  homeMarket: string;
  tracked: TrackedKeywordItem[] | null;
  error: boolean;
  counts: MarketKeywordCount[];
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <StepCard
      step="keywords"
      description={
        <UiText
          message="Track at least {0} keywords in your home storefront. The import already tracked the phrases of your {1}."
          values={[
            SETUP_KEYWORD_TARGET,
            uiLabel(
              store === "APP_STORE"
                ? "title and subtitle"
                : "title and short description",
            ),
          ]}
        />
      }
      {...step}
    >
      <p className="text-sm text-muted-foreground">
        <UiText message={homeKeywordsLine(tracked, error, homeMarket)} />
      </p>
      <FirstDiscoveries id={appId} country={homeMarket} />
      {tracked ? (
        <KeywordPicker appId={appId} country={homeMarket} tracked={tracked} />
      ) : null}
      {counts.length > 1 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {counts.map(({ market, active, error: failed }) => (
            <li
              key={market}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span>
                <UiCountry code={market} />
              </span>
              <span className="text-muted-foreground">
                {failed ? (
                  <UiText message="Unavailable" />
                ) : active === null ? (
                  <UiText message="Loading…" />
                ) : (
                  <UiText message="{0} active" values={[active]} />
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <Button asChild variant="link" className="h-auto w-fit px-0">
        <Link href={`/apps/${appId}/keywords?country=${homeMarket}`}>
          <UiText message="Review keywords" />
        </Link>
      </Button>
    </StepCard>
  );
}

const nextCountry = (markets: readonly string[]): string =>
  COUNTRY_OPTIONS.find((code) => !markets.includes(code)) ?? "";

export function CountriesStep({
  appId,
  store,
  homeMarket,
  markets,
  suggestions,
  onSelect,
  onReviewed,
  ...step
}: StepProps & {
  appId: string;
  store: Store;
  homeMarket: string;
  markets: string[];
  suggestions: MarketSuggestionsResult | null;
  onSelect: (market: string, selected: boolean) => void;
  onReviewed: () => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  const suggested =
    suggestions !== null && suggestions.suggestions.length > 0
      ? suggestions
      : null;
  const [picked, setPicked] = useState(() => nextCountry(markets));
  const value = markets.includes(picked) ? nextCountry(markets) : picked;
  const addable = value !== "" && marketError(store, value) === null;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!addable) return;
    onSelect(value, true);
    setPicked(nextCountry([...markets, value]));
  };

  return (
    <StepCard
      step="countries"
      description={
        <>
          <UiText message="Your home country is selected. Add the countries you sell in; each one adds daily requests." />{" "}
          {suggested ? null : <MarketCostTip store={store} />}
        </>
      }
      {...step}
    >
      {suggested ? (
        <SuggestedMarkets
          appId={appId}
          store={store}
          result={suggested}
          selected={markets}
          onSelect={onSelect}
        />
      ) : null}
      <ul
        aria-label={uiLabel("Selected countries")}
        className="flex flex-wrap gap-2"
      >
        {markets.map((market) => (
          <li key={market}>
            <Badge variant="secondary" className="h-7 gap-1 pl-2.5">
              <UiCountry code={market} /> ({market.toUpperCase()})
              {market !== homeMarket && markets.length > 1 ? (
                <button
                  type="button"
                  aria-label={uiLabel("Remove {0}", [formatCountry(market)])}
                  onClick={() => onSelect(market, false)}
                  className="rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X />
                </button>
              ) : null}
            </Badge>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="flex flex-col gap-1">
        <Label htmlFor="setup-country">
          {suggested ? (
            <UiText message="Add another country" />
          ) : (
            <UiText message="Add a country" />
          )}
        </Label>
        <div className="flex flex-wrap items-start gap-2">
          <CountrySelect
            id="setup-country"
            store={store}
            value={value}
            onChange={setPicked}
            ariaLabel={uiLabel("Country to add")}
          />
          <Button type="submit" variant="outline" disabled={!addable}>
            <Plus />
            <UiText message="Add" />
          </Button>
        </div>
      </form>
      <div className="flex flex-wrap gap-2">
        {markets.map((market) => (
          <Button key={market} asChild variant="outline" size="sm">
            <Link href={`/apps/${appId}/keywords?country=${market}`}>
              <UiText message="Review" trailing />
              {market.toUpperCase()}
              <UiText message="keywords" />
              <ExternalLink />
            </Link>
          </Button>
        ))}
      </div>
      {step.state === "open" ? (
        <Button variant="outline" className="w-fit" onClick={onReviewed}>
          <UiText message="Countries reviewed" />
        </Button>
      ) : null}
    </StepCard>
  );
}
