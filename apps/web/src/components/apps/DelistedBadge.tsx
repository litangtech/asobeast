import { UiText } from "@/components/language/UiLanguage";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export function DelistedBadge({ since }: { since: string }) {
  return (
    <Badge
      variant="warning"
      className="w-fit"
      title={`Not listed in its store since ${formatDate(since)}`}
    >
      <UiText message="Delisted" />
    </Badge>
  );
}
