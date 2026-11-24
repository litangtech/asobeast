"use client";

import { UiText } from "@/components/language/UiLanguage";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PRODUCT_NAME } from "@/lib/brand";
import { formatCountry } from "@/lib/format";
import { appDetailOptions } from "@/lib/queries";
import { rangeLabel, type DayPreset } from "@/lib/ranges";
import { usePrintedDate } from "./use-printed-date";

export interface ReportRange {
  label: string;
  preset: DayPreset;
}

export function ReportHeader({
  id,
  page,
  ranges,
}: {
  id: string;
  page: string;
  ranges: readonly ReportRange[];
}) {
  const { data: detail } = useSuspenseQuery(appDetailOptions(id));
  const printedDate = usePrintedDate();
  const facts = [
    `Home storefront: ${formatCountry(detail.country)}`,
    ...ranges.map((range) => `${range.label}: ${rangeLabel(range.preset)}`),
  ];

  return (
    <div className="hidden flex-col gap-1 print:flex">
      <p className="text-title">
        {page}
        <UiText message="report" />
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-body text-muted-foreground">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      <p
        className="text-caption text-muted-foreground"
        suppressHydrationWarning
      >
        <UiText
          message="Printed {0} (UTC) from {1}"
          values={[printedDate, PRODUCT_NAME]}
        />
      </p>
    </div>
  );
}
