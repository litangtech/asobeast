import { UiText } from "@/components/language/UiLanguage";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";

type SubjectButtonProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size" | "asChild" | "children" | "aria-label"
> & { icon: ReactNode; label: string; subject: string };

export function SubjectButton({
  icon,
  label,
  subject,
  ...props
}: SubjectButtonProps) {
  return (
    <Button variant="outline" size="sm" {...props}>
      {icon}
      <UiText message={label} />
      <span className="sr-only">
        <UiText message=" of {0}" values={[subject]} />
      </span>
    </Button>
  );
}
