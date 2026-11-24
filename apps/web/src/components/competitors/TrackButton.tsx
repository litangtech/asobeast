"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addCompetitor, ApiError } from "@/lib/api";
import { armFocusHandoff } from "@/lib/focus-handoff";
import { invalidateCompetitorMutation } from "@/lib/queries";
import { useSingleFlight } from "@/lib/single-flight";

export function TrackButton({
  id,
  storeAppId,
  title,
  label,
  focusKey,
  className,
}: {
  id: string;
  storeAppId: string;
  title: string;
  label?: string;
  focusKey?: string;
  className?: string;
}) {
  const { text: uiLabel } = useUiLanguage();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => addCompetitor(id, storeAppId),
    onSuccess: (competitor) => {
      invalidateCompetitorMutation(queryClient, id);
      toast.success(uiLabel("Now tracking {0}", [competitor.name ?? title]));
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.envelope.message
          : uiLabel("Could not track {0}", [title]),
      );
    },
  });
  const trackOnce = useSingleFlight(mutation);

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      aria-label={label}
      aria-disabled={mutation.isPending || undefined}
      onClick={() => {
        if (focusKey) armFocusHandoff(focusKey);
        trackOnce();
      }}
    >
      {mutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
      <UiText message="Track" />
    </Button>
  );
}
