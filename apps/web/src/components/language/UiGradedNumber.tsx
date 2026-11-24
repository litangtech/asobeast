"use client";

import type { Grade } from "@/lib/grade";
import { useUiLanguage } from "./UiLanguage";

export function UiGradedNumber({
  value,
  grade,
  label,
  className,
}: {
  value: string;
  grade: Grade | null;
  label: string;
  className: string;
}) {
  const { text } = useUiLanguage();
  const spoken = grade
    ? text("{0} {1}, {2}", [text(label), value, text(grade)])
    : text("{0} {1}", [text(label), value]);
  return (
    <span data-grade={grade ?? undefined} title={spoken} className={className}>
      <span aria-hidden>{value}</span>
      <span className="sr-only">{spoken}</span>
    </span>
  );
}
