"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { Columns3, TableProperties } from "lucide-react";
import { Tabs, TabsList, TabsOption } from "@/components/ui/tabs";
import { chartViewParser, type ChartView } from "@/lib/search-params";

export function ChartViewSwitch({
  view,
  onChange,
}: {
  view: ChartView;
  onChange: (view: ChartView) => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Tabs
      value={view}
      onValueChange={(next) => onChange(chartViewParser.parse(next) ?? view)}
    >
      <TabsList aria-label={uiLabel("Layout")}>
        <TabsOption value="columns" aria-label={uiLabel("Side by side")}>
          <Columns3 aria-hidden />
        </TabsOption>
        <TabsOption value="table" aria-label={uiLabel("Table")}>
          <TableProperties aria-hidden />
        </TabsOption>
      </TabsList>
    </Tabs>
  );
}
