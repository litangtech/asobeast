import { UiDate } from "@/components/language/UiFormat";
import { UiText } from "@/components/language/UiLanguage";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RELEASE_KINDS,
  type Release,
  type ReleaseKind,
} from "@/lib/whats-new/release-notes";
import { RELEASE_KIND_DISPLAY } from "./release-kinds";

export const releaseAnchor = (version: string) =>
  `release-${version.replaceAll(".", "-")}`;

function ChangeGroup({
  release,
  kind,
}: {
  release: Release;
  kind: ReleaseKind;
}) {
  const changes = release.changes.filter((change) => change.kind === kind);
  if (changes.length === 0) return null;
  const { label, icon: Icon, badge } = RELEASE_KIND_DISPLAY[kind];
  const headingId = `${releaseAnchor(release.version)}-${kind}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h3 id={headingId}>
        <Badge variant={badge}>
          <Icon aria-hidden />
          <UiText message={label} />
        </Badge>
      </h3>
      <ul className="flex flex-col gap-3">
        {changes.map((change) => (
          <li key={change.title} className="text-body wrap-anywhere">
            <span className="font-medium text-foreground">
              <UiText message={change.title} />
              <UiText message="." trailing />
            </span>
            <span className="text-muted-foreground">
              <UiText message={change.text} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ReleaseEntry({
  release,
  latest,
}: {
  release: Release;
  latest: boolean;
}) {
  const anchor = releaseAnchor(release.version);

  return (
    <li
      id={anchor}
      className="scroll-mt-20 border-t border-border pt-8 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0"
    >
      <article
        aria-labelledby={`${anchor}-version`}
        className="grid gap-3 sm:grid-cols-[8rem_1fr] sm:gap-8"
      >
        <header className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:sticky sm:top-20 sm:flex-col sm:items-start sm:self-start">
          <h2
            id={`${anchor}-version`}
            className="text-title tracking-tight"
            translate="no"
          >
            <span className="sr-only">Version </span>
            <span>{release.version}</span>
          </h2>
          <time
            dateTime={release.date}
            className="text-caption text-muted-foreground"
          >
            <UiDate value={release.date} />
          </time>
          {latest ? (
            <Badge variant="info">
              <UiText message="Latest" />
            </Badge>
          ) : null}
        </header>
        <div className="relative flex min-w-0 flex-col gap-4 pb-8 sm:border-l sm:border-border sm:pl-8">
          <span
            aria-hidden
            className={cn(
              "absolute top-2 -left-[5px] hidden size-2.5 rounded-full ring-4 ring-background sm:block",
              latest ? "bg-foreground" : "bg-border",
            )}
          />
          <div className="flex flex-col gap-1.5">
            <p className="text-subtitle font-semibold text-balance text-foreground">
              <UiText message={release.title} />
            </p>
            <p className="text-body text-muted-foreground">
              <UiText message={release.summary} />
            </p>
          </div>
          {RELEASE_KINDS.map((kind) => (
            <ChangeGroup key={kind} release={release} kind={kind} />
          ))}
        </div>
      </article>
    </li>
  );
}
