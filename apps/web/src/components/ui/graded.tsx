import { UiGradedNumber } from "@/components/language/UiGradedNumber";
import { type Grade } from "@/lib/grade";
import { cn } from "@/lib/utils";

const GRADE_TEXT: Record<Grade, string> = {
  strong: "text-grade-strong",
  fair: "text-grade-fair",
  weak: "text-grade-weak",
  poor: "text-grade-poor",
};

const GRADE_FILL: Record<Grade, string> = {
  strong: "bg-grade-strong",
  fair: "bg-grade-fair",
  weak: "bg-grade-weak",
  poor: "bg-grade-poor",
};

const GRADE_WASH: Record<Grade, string> = {
  strong: "bg-grade-strong-subtle",
  fair: "bg-grade-fair-subtle",
  weak: "bg-grade-weak-subtle",
  poor: "bg-grade-poor-subtle",
};

export function gradeFill(value: Grade): string {
  return GRADE_FILL[value];
}

export function gradeWash(value: Grade): string {
  return GRADE_WASH[value];
}

export function GradedNumber({
  value,
  grade,
  label,
  className,
}: {
  value: string;
  grade: Grade | null;
  label: string;
  className?: string;
}) {
  return (
    <UiGradedNumber
      value={value}
      grade={grade}
      label={label}
      className={cn("numeric font-mono", grade && GRADE_TEXT[grade], className)}
    />
  );
}
