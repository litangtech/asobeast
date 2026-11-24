"use client";

import { UiDate } from "@/components/language/UiFormat";
import { UiText } from "@/components/language/UiLanguage";
import type { ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ActionSummary } from "@asobeast/shared";
import { Separated } from "@/components/ui/separated";
import { formatNumber } from "@/lib/format";
import { actionSummaryFor } from "@/lib/queries";

function statusParts(summary: ActionSummary): ReactNode[] {
  const { critical, high } = summary.openByPriority;
  return [
    `${formatNumber(summary.open)} open`,
    critical > 0 ? (
      <span className="text-priority-critical">
        <UiText message="{0} critical" values={[formatNumber(critical)]} />
      </span>
    ) : null,
    high > 0 ? `${formatNumber(high)} high` : null,
    summary.generatedAt ? (
      <span>
        <UiText message="generated" />{" "}
        <time dateTime={summary.generatedAt}>
          <UiDate value={summary.generatedAt} style="dateTime" />
        </time>
      </span>
    ) : (
      "not generated yet"
    ),
  ].filter((part) => part !== null);
}

export function ActionStatusLine({ appId }: { appId?: string }) {
  const { data: summary } = useSuspenseQuery(actionSummaryFor(appId));

  return (
    <p data-slot="action-status" className="text-body text-muted-foreground">
      <Separated parts={statusParts(summary)} />
      {appId === undefined && summary.suppressedByCap > 0 ? (
        <span className="hidden @md/actions:inline">
          <span aria-hidden> · </span>
          <span>
            <UiText
              message="{0} withheld by the per app cap"
              values={[formatNumber(summary.suppressedByCap)]}
            />
          </span>
        </span>
      ) : null}
    </p>
  );
}
