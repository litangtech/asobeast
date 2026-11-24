"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { Tabs, TabsList, TabsOption } from "@/components/ui/tabs";
import { rangeLabel, type DayPreset } from "@/lib/ranges";

export function PrintRangeLabel({ preset }: { preset: DayPreset }) {
  return (
    <span className="hidden text-body text-muted-foreground print:inline">
      {rangeLabel(preset)}
    </span>
  );
}

export function RangePicker<T extends DayPreset>({
  presets,
  value,
  onChange,
  label,
}: {
  presets: readonly T[];
  value: T;
  onChange: (next: T) => void;
  label?: string;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as T)}>
      <TabsList
        aria-label={label ?? uiLabel("Date range")}
        className="print:hidden"
      >
        {presets.map((preset) => (
          <TabsOption key={preset} value={preset}>
            {preset}
          </TabsOption>
        ))}
      </TabsList>
      <PrintRangeLabel preset={value} />
    </Tabs>
  );
}
