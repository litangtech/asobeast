"use client";

import { UiDate } from "@/components/language/UiFormat";
import { UiText } from "@/components/language/UiLanguage";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatPlanLimit } from "@/lib/format";
import { budgetOptions } from "@/lib/queries";
import { keywordLimitExceededSince } from "@/lib/quota-usage";

export function KeywordLimitNotice() {
  const { data: budget } = useSuspenseQuery(budgetOptions);
  const since = keywordLimitExceededSince(budget.quota);

  if (!budget.quota || !since) return null;

  return (
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertDescription>
        <UiText message="Over the keyword limit since" trailing />
        <UiDate value={since} />
        <UiText message=". Daily checks cover the first" trailing />
        {formatPlanLimit(budget.quota.keywordMarkets.limit)}
        <UiText message="keyword markets in a stable order; remove keywords or upgrade to cover the rest." />
      </AlertDescription>
    </Alert>
  );
}
