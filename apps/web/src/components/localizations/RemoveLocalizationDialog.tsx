"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import type {
  AppLocalizationItem,
  AppLocalizationsResult,
} from "@asobeast/shared";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { removeAppLocalization } from "@/lib/api";
import {
  removeDescription,
  withoutLocalization,
} from "@/lib/app-localizations";
import { localizationName } from "@/lib/localizations";
import { appKeys, invalidateLocalizationMutation } from "@/lib/queries";
import { fieldLocaleParser } from "@/lib/search-params";
import { useSingleFlight } from "@/lib/single-flight";
import { apiErrorMessage } from "./api-error-message";

export function RemoveLocalizationDialog({
  id,
  item,
}: {
  id: string;
  item: AppLocalizationItem;
}) {
  const { text: uiLabel } = useUiLanguage();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [fieldLocale, setFieldLocale] = useQueryState(
    "fieldLocale",
    fieldLocaleParser,
  );
  const name = localizationName(item.localization);

  const remove = useMutation({
    mutationFn: () => removeAppLocalization(id, item.localization),
    onSuccess: () => {
      queryClient.setQueryData<AppLocalizationsResult>(
        appKeys.localizations(id),
        (current) => current && withoutLocalization(current, item.localization),
      );
      invalidateLocalizationMutation(queryClient, id);
      setOpen(false);
      if (fieldLocale === item.localization) {
        void setFieldLocale(null, { history: "replace" });
      }
      toast.success(uiLabel("Removed {0}", [name]));
    },
    onError: (err) =>
      toast.error(apiErrorMessage(err, `Could not remove ${name}`)),
  });
  const removeOnce = useSingleFlight(remove);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!remove.isPending) setOpen(next);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <UiText message="Remove localization" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <UiText message="Remove" trailing />
            {name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {removeDescription(item)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={remove.isPending}>
            <UiText message="Cancel" />
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={remove.isPending}
            onClick={(event) => {
              event.preventDefault();
              removeOnce();
            }}
          >
            {remove.isPending ? (
              <UiText message="Removing…" />
            ) : (
              <UiText message="Remove" />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
