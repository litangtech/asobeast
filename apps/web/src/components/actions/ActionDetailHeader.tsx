import { UiCountry } from "@/components/language/UiFormat";
import { UiText } from "@/components/language/UiLanguage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ACTION_RULE_TITLES, type ActionItem } from "@asobeast/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { storeLabel } from "@/lib/format";
import { ACTION_CATEGORY_LABEL, ACTION_STATUS_LABEL } from "./action-copy";
import { LocalizedActionHeadline } from "./LocalizedActionHeadline";
import { actionHref, actionSection } from "./action-links";
import { ActionPriorityBadge } from "./ActionPriorityBadge";
import { ActionStateControls } from "./ActionStateControls";
import { StatusIcon } from "./ActionStatusIcon";

export function ActionDetailHeader({ item }: { item: ActionItem }) {
  const href = actionHref(item);

  return (
    <SheetHeader className="gap-3 border-b p-4 pr-12">
      <div className="flex flex-wrap items-center gap-2">
        <ActionPriorityBadge priority={item.priority} />
        <Badge variant="secondary">
          <UiText message={ACTION_CATEGORY_LABEL[item.category]} />
        </Badge>
        <Badge variant="outline">
          <StatusIcon status={item.status} />
          <span>
            <UiText message={ACTION_STATUS_LABEL[item.status]} />
          </span>
        </Badge>
      </div>
      <SheetTitle className="text-title text-balance">
        <LocalizedActionHeadline item={item} />
      </SheetTitle>
      <SheetDescription>
        <UiText message={ACTION_RULE_TITLES[item.rule]} /> ·{" "}
        {item.scope.appName ?? <UiText message="An app" />} ·{" "}
        {storeLabel(item.scope.store)} · <UiCountry code={item.scope.country} />
      </SheetDescription>
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm">
          <Link href={href}>
            <UiText message="Fix it in" trailing />
            <UiText message={actionSection(href)} />
            <ArrowRight aria-hidden />
          </Link>
        </Button>
        <ActionStateControls item={item} />
      </div>
    </SheetHeader>
  );
}
