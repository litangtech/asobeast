"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { Plus, Tags, Upload } from "lucide-react";
import type { Ref } from "react";
import type { Store } from "@asobeast/shared";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCountry } from "@/lib/format";
import { AddKeywordsDialog } from "./AddKeywordsDialog";
import { ImportKeywordsDialog } from "./ImportKeywordsDialog";

export function KeywordsEmptyState({
  appId,
  store,
  country,
  addRef,
}: {
  appId: string;
  store: Store;
  country: string;
  addRef?: Ref<HTMLButtonElement>;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <EmptyState
      icon={Tags}
      title={uiLabel("No keywords tracked in {0} yet", [
        formatCountry(country),
      ])}
      body="Add the phrases you want this app to rank for and AsoBeast starts capturing positions on the next daily run."
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <ImportKeywordsDialog appId={appId} store={store} country={country}>
            <Button variant="outline">
              <Upload />
              <UiText message="Import CSV" />
            </Button>
          </ImportKeywordsDialog>
          <AddKeywordsDialog appId={appId} store={store} country={country}>
            <Button ref={addRef}>
              <Plus />
              <UiText message="Add keywords" />
            </Button>
          </AddKeywordsDialog>
        </div>
      }
    />
  );
}
