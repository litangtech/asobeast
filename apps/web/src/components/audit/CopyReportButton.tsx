"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import type { AppAuditResult } from "@asobeast/shared";
import { Button } from "@/components/ui/button";
import { auditMarkdown } from "./audit-report";

export function CopyReportButton({
  audit,
  app,
}: {
  audit: AppAuditResult;
  app: { name: string | null; country: string };
}) {
  const { text: uiLabel } = useUiLanguage();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(auditMarkdown(audit, app));
      toast.success(uiLabel("Report copied"));
    } catch {
      toast.error(uiLabel("Your browser blocked the clipboard"));
    }
  };

  return (
    <Button variant="outline" className="w-fit" onClick={() => void copy()}>
      <Copy />
      <UiText message="Copy report" />
    </Button>
  );
}
