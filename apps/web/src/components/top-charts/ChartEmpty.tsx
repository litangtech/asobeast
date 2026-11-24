"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import { accountPlanOptions } from "@/lib/queries";
import { emptyChartBody } from "./chart-actions";

export function ChartEmpty({
  captured,
  date,
  action,
  className,
}: {
  captured: boolean;
  date: string | null;
  action?: ReactNode;
  className?: string;
}) {
  const { text: uiLabel } = useUiLanguage();
  const limits = useQuery(accountPlanOptions).data?.limits;
  return (
    <EmptyState
      className={className}
      icon={Trophy}
      title={
        captured
          ? uiLabel("No capture of this chart on {0}", [formatDate(date)])
          : uiLabel("This chart has not been captured yet")
      }
      body={emptyChartBody(captured, limits)}
      action={action}
    />
  );
}
