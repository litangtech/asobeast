"use client";

import type { ActionItem } from "@asobeast/shared";
import { useUiLanguage } from "@/components/language/UiLanguage";
import { actionHeadline } from "./action-headline";
import { actionHeadlineZh } from "./action-headline.zh-cn";

export function useActionHeadline(item: ActionItem): string {
  const { language } = useUiLanguage();
  return language === "zh-CN" ? actionHeadlineZh(item) : actionHeadline(item);
}

export function LocalizedActionHeadline({ item }: { item: ActionItem }) {
  return <span>{useActionHeadline(item)}</span>;
}
