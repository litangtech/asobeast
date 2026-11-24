"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import {
  chartGenreName,
  chartGenresOf,
  OVERALL_GENRE,
  type ChartGenre,
  type ChartGenreGroup,
  type Store,
} from "@asobeast/shared";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GROUP_LABELS: Record<ChartGenreGroup, string> = {
  apps: "Apps",
  games: "Games",
  family: "Family",
};

function groupsOf(store: Store): Array<[ChartGenreGroup, ChartGenre[]]> {
  const groups = new Map<ChartGenreGroup, ChartGenre[]>();
  for (const genre of chartGenresOf(store)) {
    if (genre.id === OVERALL_GENRE) continue;
    groups.set(genre.group, [...(groups.get(genre.group) ?? []), genre]);
  }
  return [...groups];
}

export function GenreSelect({
  store,
  value,
  onChange,
}: {
  store: Store;
  value: string;
  onChange: (genre: string) => void;
}) {
  const { text: uiLabel } = useUiLanguage();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={uiLabel("Category")} className="w-[220px]">
        <SelectValue>
          {uiLabel(chartGenreName(store, value) ?? value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={OVERALL_GENRE}>
          <UiText message="Overall" />
        </SelectItem>
        {groupsOf(store).map(([group, genres]) => (
          <SelectGroup key={group}>
            <SelectLabel>{uiLabel(GROUP_LABELS[group])}</SelectLabel>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id}>
                {uiLabel(genre.name)}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
