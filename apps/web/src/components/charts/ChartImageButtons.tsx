"use client";

import { useUiLanguage } from "@/components/language/UiLanguage";
import { Copy, ImageDown } from "lucide-react";
import { SubjectButton } from "@/components/SubjectButton";
import { useChartImage, type ChartImageJob } from "./use-chart-image";

export function ChartImageButtons({
  subject,
  makeJob,
}: {
  subject: string;
  makeJob: () => ChartImageJob | null;
}) {
  const { text: uiLabel } = useUiLanguage();
  const image = useChartImage();
  const busy = image.pending || undefined;
  const start = (act: (job: ChartImageJob) => void) => () => {
    const job = makeJob();
    if (job) act(job);
  };

  return (
    <>
      <SubjectButton
        icon={<Copy aria-hidden />}
        label={uiLabel("Copy image")}
        subject={subject}
        className="print:hidden"
        aria-disabled={busy}
        onClick={start(image.copy)}
      />
      <SubjectButton
        icon={<ImageDown aria-hidden />}
        label={uiLabel("Download PNG")}
        subject={subject}
        className="print:hidden"
        aria-disabled={busy}
        onClick={start(image.download)}
      />
    </>
  );
}
