import { UiText } from "@/components/language/UiLanguage";
import { InfoTip } from "@/components/ui/info-tip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  POSITION_SHARES,
  UNSCORED_POPULARITY,
  VISIBILITY_GUIDE,
} from "./visibility-help";

export function VisibilityHelp({ note }: { note?: string }) {
  return (
    <InfoTip
      label="About visibility"
      title="How visibility is calculated"
      summary="How close the app is to ranking first for every keyword it tracks, weighted by popularity. 100 means position 1 for all of them, 0 means none was found."
    >
      <p className="text-muted-foreground">
        <UiText message="Each keyword counts in proportion to its popularity, and less the lower it ranks:" />
      </p>
      <Table className="text-caption">
        <TableCaption className="sr-only">
          <UiText message="Share of a keyword's popularity counted at each position" />
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">
              <UiText message="Position" />
            </TableHead>
            <TableHead scope="col" className="text-right">
              <UiText message="Counts" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {POSITION_SHARES.map(({ position, share }) => (
            <TableRow key={position}>
              <TableCell className="numeric font-mono">{position}</TableCell>
              <TableCell className="text-right numeric font-mono">
                {share}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-muted-foreground">
        <UiText message="A keyword without a popularity score yet counts as popularity" />{" "}
        {UNSCORED_POPULARITY}
        <UiText message=", and one with popularity 0 does not count. Changes are in points." />
      </p>
      {note ? <p className="text-muted-foreground">{note}</p> : null}
      <a
        href={VISIBILITY_GUIDE}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-foreground underline decoration-primary underline-offset-4 hover:decoration-2"
      >
        <UiText message="Read the full calculation" />
      </a>
    </InfoTip>
  );
}
