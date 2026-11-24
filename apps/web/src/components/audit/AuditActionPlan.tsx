"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useState } from "react";
import type {
  AppAuditResult,
  AuditRecommendations,
  AuditUnlockSummary,
} from "@asobeast/shared";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BUCKET_LABEL,
  BUCKET_TAB_LABEL,
  BUCKETS,
  emptyBucketLine,
} from "./audit-copy";
import { RecommendationCard } from "./RecommendationCard";

export const PLAN_PAGE_SIZE = 5;

const unansweredCount = (unlocks: AuditUnlockSummary[] | undefined): number =>
  (unlocks ?? []).reduce((sum, unlock) => sum + unlock.checks, 0);

function BucketPanel({
  appId,
  bucket,
  recommendations,
  unanswered,
}: {
  appId: string;
  bucket: keyof AuditRecommendations;
  recommendations: AuditRecommendations;
  unanswered: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const items = recommendations[bucket];
  const shown = expanded ? items : items.slice(0, PLAN_PAGE_SIZE);

  return (
    <TabsContent value={bucket} className="flex flex-col gap-3">
      <h3 className="sr-only">
        <UiText message={BUCKET_LABEL[bucket]} />
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {emptyBucketLine(unanswered)}
        </p>
      ) : (
        <>
          {shown.map((item) => (
            <RecommendationCard
              key={`${item.factorId}-${item.checkId}`}
              appId={appId}
              item={item}
            />
          ))}
          {items.length > shown.length ? (
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => setExpanded(true)}
            >
              <UiText message="Show all" trailing />
              {items.length}
            </Button>
          ) : null}
        </>
      )}
    </TabsContent>
  );
}

export function AuditActionPlan({
  appId,
  audit,
}: {
  appId: string;
  audit: AppAuditResult;
}) {
  const { text: uiLabel } = useUiLanguage();
  const unanswered = unansweredCount(audit.unlocks);

  return (
    <section
      id="action-plan"
      aria-labelledby="action-plan-heading"
      className="flex flex-col gap-3"
    >
      <h2 id="action-plan-heading" className="text-lg font-medium">
        <UiText message="Action plan" />
      </h2>
      <Tabs defaultValue="quickWins">
        <TabsList scrollable>
          {BUCKETS.map((bucket) => (
            <TabsTrigger key={bucket} value={bucket}>
              <UiText
                message="{0}, {1}"
                values={[
                  uiLabel(BUCKET_TAB_LABEL[bucket]),
                  audit.recommendations[bucket].length,
                ]}
              />
            </TabsTrigger>
          ))}
        </TabsList>
        {BUCKETS.map((bucket) => (
          <BucketPanel
            key={bucket}
            appId={appId}
            bucket={bucket}
            recommendations={audit.recommendations}
            unanswered={unanswered}
          />
        ))}
      </Tabs>
    </section>
  );
}
