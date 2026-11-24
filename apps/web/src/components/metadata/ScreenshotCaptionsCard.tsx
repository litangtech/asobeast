"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ScreenshotThumb } from "@/components/screenshots/ScreenshotThumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { screenshotsOptions } from "@/lib/queries";
import {
  CAPTION_STATUS_LABELS,
  screenshotSummary,
} from "@/lib/screenshot-captions";

const HEADING_ID = "screenshot-captions-heading";
const THUMB_HEIGHT = 224;

export function ScreenshotCaptionsCard({
  id,
  market,
  localization,
}: {
  id: string;
  market?: string;
  localization?: string;
}) {
  const { language, text: uiLabel } = useUiLanguage();
  const { data } = useSuspenseQuery(
    screenshotsOptions(id, market, localization),
  );

  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col gap-3">
      <h2 id={HEADING_ID} className="text-lg font-medium">
        <UiText message="Screenshot captions" />
      </h2>
      <Card className="min-w-0">
        <CardContent className="flex flex-col gap-4">
          <p className="text-body text-muted-foreground" aria-live="polite">
            {screenshotSummary(data, language)}
          </p>
          {data.screenshots.length === 0 ? (
            <EmptyState
              title={uiLabel("No screenshots recorded")}
              body="Screenshots are recorded with every snapshot. Refresh the app to capture them."
            />
          ) : (
            <ol
              aria-label={uiLabel("Screenshots in store order")}
              tabIndex={0}
              className="flex gap-4 overflow-x-auto pb-2"
            >
              {data.screenshots.map((item) => (
                <li
                  key={item.position}
                  className="flex w-min shrink-0 flex-col gap-2"
                >
                  <ScreenshotThumb
                    src={item.url}
                    alt={uiLabel("Screenshot {0}", [item.position])}
                    height={THUMB_HEIGHT}
                    className="self-start"
                  />
                  <Badge variant="outline" className="self-start">
                    <UiText message={CAPTION_STATUS_LABELS[item.status]} />
                  </Badge>
                  {item.caption !== null ? (
                    <p className="min-w-28 text-body font-medium break-words text-foreground">
                      {item.caption}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
