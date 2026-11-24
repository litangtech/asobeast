"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteApp } from "@/lib/api";
import { appKeys, portfolioKey, removeAppQueries } from "@/lib/queries";
import { useSingleFlight } from "@/lib/single-flight";

export function DeleteAppMenu({ id, name }: { id: string; name: string }) {
  const { text: uiLabel } = useUiLanguage();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => deleteApp(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: appKeys.all });
      void queryClient.invalidateQueries({ queryKey: portfolioKey });
      removeAppQueries(queryClient, id);
      setConfirmOpen(false);
      toast.success(uiLabel("Deleted {0}", [name]));
    },
    onError: () => {
      toast.error(uiLabel("Could not delete {0}", [name]));
    },
  });
  const deleteOnce = useSingleFlight(mutation);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={uiLabel("App actions")}
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 />
            <UiText message="Delete app" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <UiText message="Delete" trailing />
              {name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <UiText message="This permanently removes the app and all of its snapshots, tracked keywords and ranking history. This cannot be undone." />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>
              <UiText message="Cancel" />
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={mutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                deleteOnce();
              }}
            >
              {mutation.isPending ? (
                <UiText message="Deleting…" />
              ) : (
                <UiText message="Delete app" />
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
