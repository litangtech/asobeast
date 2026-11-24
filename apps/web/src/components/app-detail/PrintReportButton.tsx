"use client";

import { UiText } from "@/components/language/UiLanguage";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintReportButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="print:hidden"
      onClick={() => window.print()}
    >
      <Printer />
      <UiText message="Print report" />
    </Button>
  );
}
