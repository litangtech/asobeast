"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AuditRecommendation } from "@asobeast/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  EFFORT_LABEL,
  IMPACT_LABEL,
  liftLabel,
  recommendationLabel,
  TARGET_LABEL,
} from "./audit-copy";
import { targetHref } from "./audit-links";

export function RecommendationCard({
  appId,
  item,
}: {
  appId: string;
  item: AuditRecommendation;
}) {
  const { language } = useUiLanguage();
  const href = item.target ? targetHref(appId, item.target) : null;
  const label = item.target ? TARGET_LABEL[item.target] : null;

  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-body font-medium">
            {recommendationLabel(item.label, language)}
          </h4>
          <span className="numeric shrink-0 font-mono text-body font-semibold">
            {liftLabel(item.lift, language)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {item.impact ? (
            <Badge variant={item.impact === "high" ? "success" : "secondary"}>
              <UiText message={IMPACT_LABEL[item.impact]} />
            </Badge>
          ) : null}
          {item.effort ? (
            <Badge variant="outline">
              <UiText message={EFFORT_LABEL[item.effort]} />
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          <UiText message={item.detail} />
        </p>
        {item.fix ? (
          <p className="text-sm">
            <UiText message={item.fix} />
          </p>
        ) : null}
        {label ? (
          href ? (
            <Link
              href={href}
              className="inline-flex w-fit items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
            >
              <UiText message={label} />
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              <UiText message={label} />
            </p>
          )
        ) : null}
      </CardContent>
    </Card>
  );
}
