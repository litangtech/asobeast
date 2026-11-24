import { UiText } from "@/components/language/UiLanguage";
import Link from "next/link";
import { adminHref } from "@/lib/admin-sections";
import { formatNumber } from "@/lib/format";

export function ListLimitNote({
  shown,
  total,
  noun,
}: {
  shown: number;
  total: number;
  noun: string;
}) {
  if (total <= shown) return null;

  return (
    <p className="text-sm text-muted-foreground">
      <UiText
        message="Showing the newest {0} of {1} {2}s."
        values={[formatNumber(shown), formatNumber(total), noun]}
      />{" "}
      <Link
        href={adminHref("workspaces")}
        className="font-medium text-foreground underline underline-offset-4"
      >
        <UiText message="Open a workspace" />
      </Link>{" "}
      <UiText message="to list all of its" trailing />
      {noun}s.
    </p>
  );
}
