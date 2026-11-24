import { uiText, type UiLanguage } from "@/lib/ui-language";
import type { ChartMovement } from "@asobeast/shared";

export interface Moved {
  movement: ChartMovement;
  delta: number | null;
  previous: number | null;
}

export function movementText(
  { movement, delta, previous }: Moved,
  noneText = "No earlier capture",
  language: UiLanguage = "en",
): string {
  if (movement === "up")
    return uiText(language, "Up {0} from #{1}", [
      Math.abs(delta ?? 0),
      previous,
    ]);
  if (movement === "down")
    return uiText(language, "Down {0} from #{1}", [delta, previous]);
  if (movement === "same") return uiText(language, "No change");
  if (movement === "new") return uiText(language, "New entry");
  return uiText(language, noneText);
}
