"use client";

import { useUiLanguage, UiText } from "@/components/language/UiLanguage";
import type { RefObject } from "react";
import { Send } from "lucide-react";
import type { Store } from "@asobeast/shared";
import { Button } from "@/components/ui/button";
import { ReplyConfirmDialog } from "./ReplyConfirmDialog";
import { consoleLabel } from "./store-console";
import { postRules } from "./store-reply-access";

export function PostReplyDialog({
  store,
  text,
  label,
  disabled,
  busy,
  textRef,
  onPost,
}: {
  store: Store;
  text: string;
  label: string;
  disabled: boolean;
  busy: boolean;
  textRef: RefObject<HTMLTextAreaElement | null>;
  onPost: () => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <ReplyConfirmDialog
      trigger={
        <Button
          size="sm"
          disabled={disabled}
          aria-disabled={busy || undefined}
          onClick={(event) => {
            if (busy) event.preventDefault();
          }}
        >
          <Send />
          <UiText message={label} />
        </Button>
      }
      title={uiLabel("Post this reply publicly?")}
      description={uiLabel(
        "AsoBeast sends this text to {0} as the reply to this review.",
        [consoleLabel(store)],
      )}
      cancelLabel={uiLabel("Keep editing")}
      actionLabel="Post"
      textRef={textRef}
      onConfirm={onPost}
    >
      <ul className="w-full list-disc space-y-1 pl-4 text-start text-body text-muted-foreground">
        {postRules(store).map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <blockquote
        dir="auto"
        className="w-full rounded-md border bg-muted/40 p-3 text-start text-body wrap-anywhere whitespace-pre-line"
      >
        {text}
      </blockquote>
    </ReplyConfirmDialog>
  );
}
