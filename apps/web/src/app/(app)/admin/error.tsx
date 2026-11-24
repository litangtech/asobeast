"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { ErrorState } from "@/components/layout/ErrorState";

export default function AdminOverviewError({
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
      scope="admin"
      title={uiLabel("Admin overview could not be loaded")}
    />
  );
}
