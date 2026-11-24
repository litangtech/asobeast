import { UiText } from "@/components/language/UiLanguage";
import { BookOpen } from "lucide-react";

export function GuideLink({
  href,
  subject,
  children,
}: {
  href: string;
  subject: string;
  children: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-foreground underline decoration-primary underline-offset-4 hover:decoration-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <BookOpen aria-hidden className="size-4 shrink-0" />
      <UiText message={children} />
      <span className="sr-only">
        <UiText message=" for {0}" values={[subject]} />
      </span>
    </a>
  );
}
