"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectFilter<T extends string>({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        const option = options.find((entry) => entry.value === next);
        if (option) onChange(option.value);
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label={uiLabel("Filter by {0}", [title.toLowerCase()])}
      >
        <SelectValue>
          {options.find((option) => option.value === value)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
