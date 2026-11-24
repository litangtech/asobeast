"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useState } from "react";
import type { TrackedKeywordItem } from "@asobeast/shared";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DEFAULT_SELECTION, pickerLabel, topByOpportunity } from "./selection";

export function KeywordPicker({
  tracked,
  value,
  onChange,
}: {
  tracked: TrackedKeywordItem[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  const [open, setOpen] = useState(false);
  const label = pickerLabel(tracked);

  const toggle = (keywordId: string) => {
    onChange(
      value.includes(keywordId)
        ? value.filter((item) => item !== keywordId)
        : [...value, keywordId],
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between gap-2 print:hidden"
        >
          {value.length}
          <UiText message="selected" />
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={uiLabel("Choose keywords")}
        className="w-72 p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={uiLabel("Search keywords…")} />
          <CommandList>
            <CommandEmpty>
              <UiText message="No keywords found." />
            </CommandEmpty>
            <CommandGroup>
              {tracked.map((keyword) => (
                <CommandItem
                  key={keyword.keywordId}
                  value={label(keyword)}
                  onSelect={() => toggle(keyword.keywordId)}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value.includes(keyword.keywordId)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <span className="truncate">{label(keyword)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() =>
                  onChange(topByOpportunity(tracked, DEFAULT_SELECTION))
                }
              >
                <UiText message="Top" trailing />
                {DEFAULT_SELECTION}
                <UiText message="by opportunity" />
              </CommandItem>
              <CommandItem onSelect={() => onChange([])}>
                <UiText message="Clear" />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
