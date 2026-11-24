"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { ReplyConfirmDialog } from "./ReplyConfirmDialog";

export function WithdrawReplyButton({
  busy,
  textRef,
  onWithdraw,
}: {
  busy: boolean;
  textRef: RefObject<HTMLTextAreaElement | null>;
  onWithdraw: () => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <ReplyConfirmDialog
      trigger={
        <Button
          variant="outline"
          size="sm"
          aria-disabled={busy || undefined}
          onClick={(event) => {
            if (busy) event.preventDefault();
          }}
        >
          <UiText message="Withdraw from App Store" />
        </Button>
      }
      title={uiLabel("Withdraw this response?")}
      description={uiLabel(
        "Apple removes it within a day. The text stays here.",
      )}
      cancelLabel={uiLabel("Keep it")}
      actionLabel="Withdraw"
      destructive
      textRef={textRef}
      onConfirm={onWithdraw}
    />
  );
}
