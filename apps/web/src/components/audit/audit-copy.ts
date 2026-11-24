import type {
  AuditCheckSource,
  AuditCheckStatus,
  AuditEffort,
  AuditFactorAvailability,
  AuditGrade,
  AuditGroupId,
  AuditImpact,
  AuditRecommendations,
  AuditScreenshotMessage,
  AuditTarget,
  Store,
} from "@asobeast/shared";
import { healthTone, type HealthTone } from "@/components/ui/meter";
import { pluralize, storeLabel } from "@/lib/format";
import { uiText, type UiLanguage } from "@/lib/ui-language";

export const PROVISIONAL_CONFIDENCE = 0.6;

export const BUCKETS = [
  "quickWins",
  "highImpact",
  "strategic",
] as const satisfies readonly (keyof AuditRecommendations)[];

const TONE_STATUS: Record<HealthTone, AuditCheckStatus> = {
  success: "pass",
  warning: "warn",
  destructive: "fail",
};

export const scoreStatus = (score: number | null): AuditCheckStatus =>
  score === null ? "unanswered" : TONE_STATUS[healthTone(score / 10)];

export function provisional(
  confidence: number | undefined,
): confidence is number {
  return confidence !== undefined && confidence < PROVISIONAL_CONFIDENCE;
}

export const GRADE_LABEL: Record<AuditGrade, string> = {
  A: "Excellent",
  B: "Good",
  C: "Fair",
  D: "Weak",
  F: "Poor",
};

export const NO_GRADE_LABEL = "Not scored yet";

export const GROUP_LABEL: Record<AuditGroupId, string> = {
  discoverability: "Search visibility",
  conversion: "Conversion",
};

export const STATUS_LABEL: Record<AuditCheckStatus, string> = {
  pass: "Pass",
  warn: "Needs work",
  fail: "Fail",
  unanswered: "Not scored yet",
};

export const SOURCE_LABEL: Record<AuditCheckSource, string> = {
  store: "Store listing",
  keywords: "Your keywords",
  competitors: "Competitors",
  reviews: "Reviews",
  rankings: "Rankings",
  ai: "AI observation",
};

export const EFFORT_LABEL: Record<AuditEffort, string> = {
  minutes: "Minutes",
  hours: "Hours",
  weeks: "Weeks",
};

export const IMPACT_LABEL: Record<AuditImpact, string> = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
};

export const BUCKET_LABEL: Record<keyof AuditRecommendations, string> = {
  quickWins: "Quick wins · Today",
  highImpact: "High impact · This week",
  strategic: "Strategic · This month",
};

export const BUCKET_TAB_LABEL: Record<keyof AuditRecommendations, string> = {
  quickWins: "Quick wins",
  highImpact: "High impact",
  strategic: "Strategic",
};

export const TARGET_LABEL: Record<AuditTarget, string> = {
  metadata: "Open the metadata workbench",
  keywords: "Open keywords",
  competitors: "Open competitors",
  reviews: "Open reviews",
  rankings: "Open rankings",
  "store-console": "Change it in your store console",
  "ai-analysis": "Analyze creative",
};

export const MESSAGE_LABEL: Record<AuditScreenshotMessage, string> = {
  benefit: "Benefit",
  feature: "Feature",
  "social-proof": "Social proof",
  "ui-only": "Interface only",
  onboarding: "Onboarding screen",
  other: "Other",
};

export const percent = (share: number): number => Math.round(share * 100);

export const gradeLabel = (grade: AuditGrade | null | undefined): string =>
  grade ? GRADE_LABEL[grade] : NO_GRADE_LABEL;

export const measuredLine = (
  confidence: number | undefined,
  language: UiLanguage = "en",
): string | null =>
  confidence === undefined
    ? null
    : uiText(language, "{0}% of the rubric measured", [percent(confidence)]);

export const potentialLine = (
  potential: number,
  language: UiLanguage = "en",
): string =>
  uiText(language, "Reach {0} by finishing the plan", [Math.round(potential)]);

export const provisionalLine = (
  confidence: number,
  language: UiLanguage = "en",
): string =>
  uiText(language, "Provisional · {0}% measured", [percent(confidence)]);

export const availabilityLabel = (
  availability: AuditFactorAvailability | undefined,
  store: Store,
): string | null => {
  if (availability === "not-measurable") {
    return `Not measured on the ${storeLabel(store)}`;
  }
  return availability === "awaiting-input" ? "Waiting for input" : null;
};

export const liftLabel = (
  lift: number | undefined,
  language: UiLanguage = "en",
): string =>
  lift === undefined
    ? uiText(language, "Lift not estimated")
    : uiText(language, "+{0} points", [lift]);

export function recommendationLabel(
  label: string,
  language: UiLanguage,
): string {
  if (language === "en") return label;
  const unused =
    /^Use the (\d+) unused (title|subtitle|short description) characters$/.exec(
      label,
    );
  if (unused)
    return uiText(language, "Use the {0} unused {1} characters", [
      unused[1],
      uiText(language, unused[2]),
    ]);
  return uiText(language, label);
}

export const emptyBucketLine = (unanswered: number): string =>
  unanswered === 0
    ? "Nothing to change here."
    : `Nothing yet. ${pluralize(unanswered, "check")} ${unanswered === 1 ? "is" : "are"} not scored, so this list may grow.`;

export const scoreRingLabel = (
  overall: number | null,
  grade: AuditGrade | null | undefined,
  confidence: number | undefined,
): string =>
  overall === null
    ? "ASO score not available yet"
    : [
        `ASO score ${Math.round(overall)} out of 100`,
        `grade ${grade ?? "none"}`,
        gradeLabel(grade),
        ...(confidence === undefined
          ? []
          : [`${percent(confidence)}% measured`]),
      ].join(", ");
