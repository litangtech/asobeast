import { UiText } from "@/components/language/UiLanguage";
import { TriangleAlert } from "lucide-react";
import type { AppDetail } from "@asobeast/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCountry, formatDate, storeLabel } from "@/lib/format";

export function DelistedNotice({
  detail,
  since,
}: {
  detail: AppDetail;
  since: string;
}) {
  const store = storeLabel(detail.store);
  const removal = detail.isCompetitor
    ? "remove it from the competitors of the app that tracks it."
    : "delete it from the dashboard.";
  return (
    <Alert variant="warning" role="note">
      <TriangleAlert aria-hidden="true" />
      <AlertTitle>
        <UiText message="No longer listed on {0}" values={[store]} />
      </AlertTitle>
      <AlertDescription>
        <p>
          <UiText
            message="Since {0}, {1} answers that it has no app {2} in {3}."
            values={[
              formatDate(since),
              store,
              detail.storeAppId,
              formatCountry(detail.country),
            ]}
          />{" "}
          <UiText message="The stored history stays, and every daily run checks again, so this notice clears on the first capture that finds the app." />
        </p>
        <p>
          <UiText message="Open the store page to check. If the app moved to a new store id, import it again from its new link." />{" "}
          <UiText message="If it is gone for good, {0}" values={[removal]} />
        </p>
      </AlertDescription>
    </Alert>
  );
}
