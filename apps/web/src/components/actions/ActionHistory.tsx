import { UiDate } from "@/components/language/UiFormat";
import { UiText } from "@/components/language/UiLanguage";
import type { ActionEventItem } from "@asobeast/shared";
import { historyEntries } from "./action-history";

export function ActionHistory({ events }: { events: ActionEventItem[] }) {
  if (events.length === 0) {
    return (
      <p className="text-body text-muted-foreground">
        <UiText message="No history recorded yet." />
      </p>
    );
  }

  return (
    <ol className="flex list-none flex-col gap-3 p-0">
      {historyEntries(events).map((entry) => (
        <li key={entry.id} className="flex flex-col gap-0.5">
          <span className="text-body font-medium">
            {entry.label}
            {entry.detail ? (
              <span className="font-normal text-muted-foreground">
                {" "}
                · {entry.detail}
              </span>
            ) : null}
          </span>
          <span className="text-caption text-muted-foreground">
            <time dateTime={entry.date}>
              <UiDate value={entry.date} style="dateTime" />
            </time>{" "}
            · {entry.actor}
          </span>
        </li>
      ))}
    </ol>
  );
}
