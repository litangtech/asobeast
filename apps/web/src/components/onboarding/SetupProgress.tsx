import { UiText, useUiLanguage } from "@/components/language/UiLanguage";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  SETUP_STEPS,
  type SetupStep,
  type SetupStepProgress,
  type SetupStepState,
} from "@asobeast/shared";
import { cn } from "@/lib/utils";
import {
  progressPercent,
  progressSentence,
  progressValueLabel,
  STEP_TITLES,
} from "./setup-progress";

export function SetupProgress({
  name,
  progress,
  states,
}: {
  name: string | null;
  progress: SetupStepProgress;
  states: Record<SetupStep, SetupStepState>;
}) {
  const { language, text } = useUiLanguage();
  const next =
    progress.next === null
      ? text("ready to complete")
      : text("next: {0}", [text(STEP_TITLES[progress.next])]);
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight text-balance">
        {language === "en"
          ? progressSentence(name, progress)
          : text("Set up {0} · {1} of {2} · {3}", [
              name ?? text("this app"),
              progress.done,
              progress.total,
              next,
            ])}
      </h2>
      <Progress
        value={progressPercent(progress)}
        aria-label={text("Setup progress")}
        getValueLabel={() =>
          language === "en"
            ? progressValueLabel(progress)
            : text("{0} of {1} steps", [progress.done, progress.total])
        }
      />
      <nav aria-label={text("Setup steps")}>
        <ol className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {SETUP_STEPS.map((step) => (
            <li key={step}>
              <a
                href={`#setup-${step}`}
                aria-current={progress.next === step ? "step" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 underline-offset-4 hover:underline",
                  progress.next === step
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {states[step] === "done" ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : null}
                <span>
                  <UiText message={STEP_TITLES[step]} />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
