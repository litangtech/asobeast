"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { useDeferredValue } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { FilteredEmpty } from "@/components/data-table/FilteredEmpty";
import { portfolioInsightsOptions, portfolioOptions } from "@/lib/queries";
import { appListParsers } from "@/lib/search-params";
import { PortfolioGrid } from "./PortfolioGrid";
import { PortfolioTable } from "./PortfolioTable";
import { filterRows, matchesQuery, sortRows, toRows } from "./portfolio-rows";

export function AppsDashboard() {
  const { text: uiLabel } = useUiLanguage();
  const { data } = useSuspenseQuery(portfolioOptions);
  const { data: insights } = useSuspenseQuery(portfolioInsightsOptions);
  const [{ q, sort, dir, view }, setList] = useQueryStates(appListParsers);
  const query = useDeferredValue(q);

  const insightById = new Map(
    insights.apps.map((insight) => [insight.appId, insight]),
  );
  const rows = sortRows(
    filterRows(toRows(data.apps), query),
    { sort, dir },
    insightById,
  );

  if (rows.length === 0) {
    return (
      <FilteredEmpty
        title={uiLabel('No apps match "{0}"', [q])}
        onClear={() => void setList({ q: null })}
      />
    );
  }

  if (view === "table") {
    return (
      <PortfolioTable
        rows={data.apps
          .filter((app) => matchesQuery(app, query))
          .map((app) => ({ app, insight: insightById.get(app.id) }))}
      />
    );
  }

  return (
    <PortfolioGrid rows={rows} groups={data.groups} insights={insightById} />
  );
}
