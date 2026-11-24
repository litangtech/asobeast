"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import type { ChangeImpactWindow, Store } from "@asobeast/shared";
import { DeltaChip } from "@/components/ui/delta-chip";
import { FUNNEL_GETS_LABEL } from "@/lib/funnel";
import {
  funnelNote,
  funnelRanges,
  measuredLine,
  movementLine,
  overlapNotice,
  rankingShiftLine,
  visibilityRange,
  windowStatusLine,
  windowTitle,
} from "./change-impact-copy";

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-label text-muted-foreground uppercase">
        <UiText message={label} />
      </dt>
      {children}
    </div>
  );
}

function MeasuredFacts({ impact }: { impact: ChangeImpactWindow }) {
  const { language } = useUiLanguage();
  const range = visibilityRange(impact);
  if (impact.movement === null || range === null) return null;
  const shift = rankingShiftLine(impact.movement, language);

  return (
    <dl className="flex flex-col gap-2 text-body">
      <Fact label="Visibility">
        <dd className="flex items-center gap-2">
          <span className="numeric font-mono">{range}</span>
          <DeltaChip
            value={impact.visibilityChange}
            polarity="higher-is-better"
            period="in visibility"
          />
        </dd>
      </Fact>
      <Fact label="Keywords">
        <dd>{movementLine(impact.movement, language)}</dd>
        {shift ? <dd>{shift}</dd> : null}
        <dd className="text-caption text-muted-foreground">
          {measuredLine(impact.movement, language)}
        </dd>
      </Fact>
      <Fact label="Median position">
        <dd>
          {impact.medianPositionChange === null ? (
            <span className="text-muted-foreground">
              <UiText message="No keyword ranked on both days" />
            </span>
          ) : (
            <DeltaChip value={impact.medianPositionChange} period="positions" />
          )}
        </dd>
      </Fact>
    </dl>
  );
}

interface WindowProps {
  impact: ChangeImpactWindow;
  store: Store;
}

export function FunnelFacts({ impact, store }: WindowProps) {
  const { language } = useUiLanguage();
  const ranges = funnelRanges(impact.funnel);
  const note = funnelNote(impact.funnel, impact.days, language);
  if (!ranges && !note) return null;
  const gets = impact.funnel?.change?.gets ?? null;
  const getsLabel = FUNNEL_GETS_LABEL[store];

  return (
    <dl className="flex flex-col gap-2 text-body">
      <Fact label="Store funnel">
        {ranges ? (
          <>
            <dd className="flex flex-wrap items-center gap-2">
              <UiText message={getsLabel} />
              <span className="numeric font-mono">{ranges.gets}</span>
              <DeltaChip
                value={gets === null ? null : Math.round(gets * 100)}
                polarity="higher-is-better"
                period={`percent in ${getsLabel}`}
                unit="%"
              />
            </dd>
            <dd className="flex flex-wrap items-center gap-2">
              <span>
                <UiText message="Conversion" />
              </span>
              <span className="numeric font-mono">{ranges.conversion}</span>
            </dd>
          </>
        ) : (
          <dd className="text-caption text-muted-foreground">{note}</dd>
        )}
      </Fact>
    </dl>
  );
}

export function ChangeImpactWindowTile({ impact, store }: WindowProps) {
  const { language } = useUiLanguage();
  const notice = overlapNotice(impact.overlappingChanges, language);

  return (
    <li className="flex flex-col gap-2 rounded-lg border p-3">
      <h4 className="text-body font-medium">
        {windowTitle(impact.days, language)}
      </h4>
      <p className="text-caption text-muted-foreground">
        {windowStatusLine(impact, language)}
      </p>
      <MeasuredFacts impact={impact} />
      <FunnelFacts impact={impact} store={store} />
      {notice ? (
        <p className="flex items-start gap-1.5 text-caption text-muted-foreground">
          <TriangleAlert
            aria-hidden
            className="mt-0.5 size-3.5 shrink-0 text-warning"
          />
          {notice}
        </p>
      ) : null}
    </li>
  );
}
