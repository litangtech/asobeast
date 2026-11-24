"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { KeywordMover } from "@asobeast/shared";
import { MoverList } from "@/components/rankings/MoverRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKeywordScope } from "@/components/app-detail/use-market";
import { appSummaryOptions } from "@/lib/queries";

export function MoversCard({ id }: { id: string }) {
  const { text: uiLabel } = useUiLanguage();
  const { country } = useKeywordScope(id);
  const { data: summary } = useSuspenseQuery(appSummaryOptions(id, country));
  const rankingsHref = (mover: KeywordMover) =>
    `/apps/${id}/rankings?keywords=${mover.keywordId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <UiText message="Keyword movers" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <MoverList
          title={uiLabel("Climbers")}
          movers={summary.movers.up}
          renderHref={rankingsHref}
        />
        <MoverList
          title={uiLabel("Fallers")}
          movers={summary.movers.down}
          renderHref={rankingsHref}
        />
      </CardContent>
    </Card>
  );
}
