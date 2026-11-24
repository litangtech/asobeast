import { UiText } from "@/components/language/UiLanguage";
import type { SerpExitItem } from "@asobeast/shared";
import { AppIcon } from "@/components/AppIcon";
import { formatDayMonth } from "@/lib/format";
import { serpRole, type SerpViewer } from "./serp-csv";
import { SerpSection } from "./SerpList";
import { SERP_ROW_GRID, SerpAppText } from "./SerpRow";

export function SerpExits({
  exits,
  comparedTo,
  viewer,
}: {
  exits: readonly SerpExitItem[];
  comparedTo: string;
  viewer: SerpViewer;
}) {
  return (
    <SerpSection heading={`Left since ${formatDayMonth(comparedTo)}`}>
      <ul className="flex flex-col text-muted-foreground">
        {exits.map((exit) => (
          <li key={exit.storeAppId} className={SERP_ROW_GRID}>
            <span className="col-start-1 row-span-2 row-start-1 text-right text-caption">
              <span aria-hidden>
                <UiText message="was {0}" values={[exit.previous]} />
              </span>
              <span className="sr-only">
                <UiText
                  message="was number {0}, not in this list"
                  values={[exit.previous]}
                />
              </span>
            </span>
            <span className="col-start-2 row-span-2 row-start-1">
              <AppIcon src={exit.iconUrl} name={exit.title} size={40} />
            </span>
            <SerpAppText
              title={exit.title}
              developer={exit.developer}
              role={serpRole(exit, viewer)}
            />
          </li>
        ))}
      </ul>
    </SerpSection>
  );
}
