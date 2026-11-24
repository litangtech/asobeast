"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { ErrorState } from "@/components/layout/ErrorState";

export default function AuditError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <ErrorState
      error={error}
      retry={retry}
      title={uiLabel("Audit could not be loaded")}
    />
  );
}
