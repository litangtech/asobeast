import { UiText } from "@/components/language/UiLanguage";
import type { AppLocalizationOrigin } from "@asobeast/shared";
import { Badge } from "@/components/ui/badge";

export function OriginBadge({ origin }: { origin: AppLocalizationOrigin }) {
  if (origin === "home")
    return (
      <Badge variant="outline">
        <UiText message="Home" />
      </Badge>
    );
  if (origin === "detected")
    return (
      <Badge variant="info">
        <UiText message="Detected" />
      </Badge>
    );
  return null;
}
