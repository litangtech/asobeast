"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError, completePlaySignIn } from "@/lib/api";
import { invalidateStoreConnectionMutation } from "@/lib/queries";
import { STORE_CONNECTIONS_PATH } from "@/lib/store-connection-copy";

function ReturnCard({
  title,
  description,
  pending = false,
}: {
  title: string;
  description: string;
  pending?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle asChild>
          <h1>
            <UiText message={title} />
          </h1>
        </CardTitle>
        <CardDescription role={pending ? "status" : undefined}>
          <UiText message={description} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pending ? (
          <Loader2
            aria-hidden="true"
            className="animate-spin text-muted-foreground"
          />
        ) : (
          <Button asChild variant="outline">
            <Link href={STORE_CONNECTIONS_PATH}>
              <UiText message="Back to store connections" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function PlaySignInReturn() {
  const { text: uiLabel } = useUiLanguage();
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const code = params.get("code") ?? "";
  const state = params.get("state") ?? "";
  const denied = params.get("error") !== null;
  const ready = !denied && code !== "" && state !== "";
  const started = useRef(false);
  const { mutate, isError, error } = useMutation({
    mutationFn: () => completePlaySignIn({ code, state }),
    onSuccess: () => {
      invalidateStoreConnectionMutation(queryClient);
      toast.success(uiLabel("Google Play Console connected"));
      router.replace(STORE_CONNECTIONS_PATH);
    },
  });

  useEffect(() => {
    if (!ready || started.current) return;
    started.current = true;
    mutate();
  }, [ready, mutate]);

  if (denied) {
    return (
      <ReturnCard
        title={uiLabel("Google sign in was cancelled")}
        description={uiLabel(
          "Nothing was connected. Start again from store connections when you are ready.",
        )}
      />
    );
  }
  if (!ready) {
    return (
      <ReturnCard
        title={uiLabel("This sign in is incomplete")}
        description={uiLabel(
          "Google did not return the code AsoBeast needs. Start the sign in again from store connections.",
        )}
      />
    );
  }
  if (isError) {
    return (
      <ReturnCard
        title={uiLabel("Google Play was not connected")}
        description={
          error instanceof ApiError
            ? error.envelope.message
            : uiLabel(
                "Could not finish the Google sign in. Try again from store connections.",
              )
        }
      />
    );
  }
  return (
    <ReturnCard
      title={uiLabel("Connecting Google Play")}
      description={uiLabel("Checking the bucket with your Google account.")}
      pending
    />
  );
}
