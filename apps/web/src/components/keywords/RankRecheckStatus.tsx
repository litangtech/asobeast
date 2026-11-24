import { UiText } from "@/components/language/UiLanguage";
import type { TrackedKeywordItem } from "@asobeast/shared";

export function RankRecheckStatus({
  keyword,
}: {
  keyword: Pick<TrackedKeywordItem, "latestPosition" | "lastRankedPosition">;
}) {
  const confirmed = keyword.latestPosition ?? keyword.lastRankedPosition;
  return (
    <span className="inline-flex flex-col whitespace-nowrap">
      <UiText message="Recheck pending" />
      {confirmed != null ? (
        <span className="text-caption text-muted-foreground">
          <UiText message="Last confirmed: #{0}" values={[confirmed]} />
        </span>
      ) : null}
    </span>
  );
}
