import { UiText } from "@/components/language/UiLanguage";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NotInSearchNotice() {
  return (
    <Alert variant="warning" role="note">
      <TriangleAlert aria-hidden="true" />
      <AlertTitle>
        <UiText message="Not listed in iPhone search" />
      </AlertTitle>
      <AlertDescription>
        <UiText message="This app is not available on iPhone, and AsoBeast reads iPhone search, so its keywords are never found within the checked depth and its visibility stays at 0." />
      </AlertDescription>
    </Alert>
  );
}
