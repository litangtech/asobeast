"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { ErrorState } from "@/components/layout/ErrorState";

export default function KeywordsError({
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
      title={uiLabel("Keywords could not be loaded")}
    />
  );
}
