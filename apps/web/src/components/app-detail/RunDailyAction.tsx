"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ApiError, runDaily } from "@/lib/api";
import { pluralize } from "@/lib/format";
import { appKeys } from "@/lib/queries";
import { queuedToast } from "@/lib/queued-toast";
import { useSingleFlight } from "@/lib/single-flight";

export function RunDailyAction({ appId }: { appId: string }) {
  const { text: uiLabel } = useUiLanguage();
  const queryClient = useQueryClient();
  const busy = useIsMutating({ mutationKey: ["app-action", appId] }) > 0;

  const mutation = useMutation({
    mutationKey: ["app-action", appId, "run-daily"],
    mutationFn: () => runDaily(appId),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: appKeys.detail(appId) });
      const { apps, keywords, categories, reviews } = result.enqueued;
      const jobs = apps + keywords + categories + reviews;
      if (jobs === 0) {
        toast.info(uiLabel("Nothing new to queue"), {
          description:
            "Today's checks for this app are already queued, running or done.",
        });
        return;
      }
      queuedToast(
        keywords > 0
          ? `rank checks for ${pluralize(keywords, "keyword")}`
          : pluralize(jobs, "job"),
        "Follow the run in the header; tables update as positions land.",
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.envelope.message
          : uiLabel("Run daily failed"),
      );
    },
  });
  const runOnce = useSingleFlight(mutation);

  return (
    <Button
      variant="outline"
      aria-disabled={busy || undefined}
      onClick={() => {
        if (!busy) runOnce();
      }}
      aria-label={uiLabel("Run daily")}
    >
      {mutation.isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <CalendarClock />
      )}
      <span className="hidden lg:inline">
        <UiText message="Run daily" />
      </span>
    </Button>
  );
}
