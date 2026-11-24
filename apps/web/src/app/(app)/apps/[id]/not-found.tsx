import { UiText } from "@/components/language/UiLanguage";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="flex flex-col gap-1">
        <p className="font-medium">
          <UiText message="App not found" />
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          <UiText message="This app does not exist or has been deleted." />
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <UiText message="Back to apps" />
        </Link>
      </Button>
    </div>
  );
}
