"use client";

import { UiText } from "@/components/language/UiLanguage";
import { Download } from "lucide-react";
import { KEYWORD_IMPORT_LIMIT } from "@asobeast/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { downloadCsv, toCsv } from "@/lib/csv";
import { formatNumber } from "@/lib/format";

const TEMPLATE = toCsv(
  ["keyword", "country", "tags", "note"],
  [
    ["habit tracker", "us", "core; brand", "Launch keyword"],
    ["streak counter", "pl", "testing", null],
  ],
);

const PARTS_HINT = `A long file is imported in parts of up to ${formatNumber(KEYWORD_IMPORT_LIMIT)} rows.`;

export function ImportFileStep({
  fileName,
  onChoose,
  disabled,
}: {
  fileName: string | null;
  onChoose: (file: File | undefined) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="keyword-import-file">
        <UiText message="Keyword file" />
      </Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id="keyword-import-file"
          type="file"
          accept=".csv,.tsv,.txt,text/csv,text/plain"
          className="max-w-xs"
          disabled={disabled}
          onChange={(event) => onChoose(event.target.files?.[0])}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadCsv("keyword-import-template.csv", TEMPLATE)}
        >
          <Download aria-hidden />
          <UiText message="Download template" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {fileName ? (
          <UiText message="Reading {0}. {1}" values={[fileName, PARTS_HINT]} />
        ) : (
          <UiText
            message="{0} UTF-8 or UTF-16, separated by commas, semicolons, tabs or pipes."
            values={[PARTS_HINT]}
          />
        )}
      </p>
    </div>
  );
}
