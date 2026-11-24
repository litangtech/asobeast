"use client";

import { UiText } from "@/components/language/UiLanguage";
import Link from "next/link";
import { useAuth } from "@/components/auth/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCountry, formatNumber } from "@/lib/format";

export const keywordCount = (count: number) =>
  `${formatNumber(count)} keyword${count === 1 ? "" : "s"}`;

export function TrackCombinationsDialog({
  count,
  market,
  open,
  pending,
  onOpenChange,
  onConfirm,
}: {
  count: number;
  market: string;
  open: boolean;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const storefront = formatCountry(market);
  const { isOperator } = useAuth();
  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <UiText message="Track" trailing />
            {keywordCount(count)} in {storefront}?
          </DialogTitle>
          <DialogDescription>
            <UiText
              message="Each tracked keyword adds one store search a day in"
              trailing
            />
            {storefront}.
            {isOperator ? (
              <>
                {" "}
                <Link
                  href="/settings#daily-capacity"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  <UiText message="Review the daily request budget" />
                </Link>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            <UiText message="Cancel" />
          </Button>
          <Button disabled={pending} onClick={onConfirm}>
            <UiText message="Track" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
