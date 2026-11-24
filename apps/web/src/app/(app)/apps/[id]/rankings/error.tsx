"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { ErrorState } from "@/components/layout/ErrorState";

export default function RankingsError({
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
      title={uiLabel("Rankings could not be loaded")}
    />
  );
}
