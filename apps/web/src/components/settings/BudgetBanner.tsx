"use client";

import { UiText } from "@/components/language/UiLanguage";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { budgetOptions } from "@/lib/queries";
import { utilizationLevel } from "@/lib/utilization";

export function BudgetBanner() {
  const { data: budget } = useSuspenseQuery(budgetOptions);
  if (utilizationLevel(budget.utilization) !== "danger") {
    return null;
  }

  return (
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertDescription>
        <UiText message="Daily requests exceed 85% of your store rate limit." />{" "}
        <Link href="/settings" className="font-medium underline">
          <UiText message="Review the request budget" />
        </Link>
        .
      </AlertDescription>
    </Alert>
  );
}
