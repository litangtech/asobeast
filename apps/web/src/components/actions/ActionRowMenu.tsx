"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import type { ActionItem, ActionUpdateRequest } from "@asobeast/shared";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionDismissSubMenu } from "./ActionDismissMenu";
import { SNOOZE_PRESET_DAYS, snoozeUntil } from "./ActionSnoozeMenu";

export function ActionRowMenu({
  item,
  headline,
  href,
  disabled,
  onUpdate,
}: {
  item: ActionItem;
  headline: string;
  href: string;
  disabled: boolean;
  onUpdate: (body: ActionUpdateRequest) => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${href}`);
    toast.success(uiLabel("Link copied"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          aria-label={uiLabel("More actions for {0}", [headline])}
          data-command="more"
          className="size-11 @2xl/queue:size-7"
        >
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {item.status === "SNOOZED" ? (
          <DropdownMenuItem onSelect={() => onUpdate({ status: "OPEN" })}>
            <UiText message="Wake now" />
          </DropdownMenuItem>
        ) : (
          SNOOZE_PRESET_DAYS.map((days) => (
            <DropdownMenuItem
              key={days}
              onSelect={() =>
                onUpdate({ status: "SNOOZED", snoozedUntil: snoozeUntil(days) })
              }
            >
              <UiText message="Snooze" trailing />
              {days}
              <UiText message="days" />
            </DropdownMenuItem>
          ))
        )}
        <ActionDismissSubMenu
          onDismiss={(reason) => onUpdate({ status: "DISMISSED", reason })}
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void copyLink()}>
          <UiText message="Copy link" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
