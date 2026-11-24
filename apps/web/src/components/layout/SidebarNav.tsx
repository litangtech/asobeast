"use client";

import { UiText, useUiLanguage } from "@/components/language/UiLanguage";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardCheck,
  FileText,
  Gauge,
  History,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  Plug,
  Settings,
  Star,
  Swords,
  Tags,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { INTEGRATIONS_PATH } from "@asobeast/shared";
import { ADMIN_ENTRY } from "@/components/admin/admin-links";
import { AlertsUnreadDot } from "@/components/alerts/AlertsUnreadDot";
import { useAuth } from "@/components/auth/use-auth";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  APP_SECTIONS,
  type AppSectionSegment,
  appRouteFrom,
  isSectionActive,
  sectionHref,
} from "@/lib/app-sections";
import { adminSectionFrom } from "@/lib/admin-sections";
import { actionSummaryOptions } from "@/lib/queries";

const SECTION_ICONS: Record<AppSectionSegment, LucideIcon> = {
  "": Gauge,
  actions: Lightbulb,
  keywords: Tags,
  rankings: TrendingUp,
  competitors: Swords,
  changes: History,
  reviews: Star,
  audit: ClipboardCheck,
  metadata: FileText,
};

const WORKSPACE = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/actions", label: "Action Center", icon: ListChecks },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/charts", label: "Top charts", icon: Trophy },
  { href: INTEGRATIONS_PATH, label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const DISPLAY_MAX = 99;

function OpenActionBadge() {
  const { status } = useAuth();
  const { data } = useQuery({
    ...actionSummaryOptions,
    enabled: Boolean(status?.authenticated),
  });
  const open = data?.open ?? 0;
  if (open === 0) return null;

  return (
    <>
      <span className="sr-only">
        <UiText
          message=", {0} open action{1}"
          values={[open, open === 1 ? "" : "s"]}
        />
      </span>
      <SidebarMenuBadge aria-hidden className="numeric">
        {open > DISPLAY_MAX ? `${DISPLAY_MAX}+` : open}
      </SidebarMenuBadge>
    </>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
  children,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onNavigate: () => void;
  children?: ReactNode;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={label} isActive={active}>
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
        >
          <Icon />
          <span>{label}</span>
          {children}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function SidebarNav() {
  const { text } = useUiLanguage();
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const { isOperator } = useAuth();
  const app = appRouteFrom(pathname);

  const close = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>
          <span>{text("Workspace")}</span>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {WORKSPACE.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                label={text(label)}
                icon={icon}
                active={pathname === href}
                onNavigate={close}
              >
                {href === "/actions" ? <OpenActionBadge /> : null}
                {href === "/alerts" ? <AlertsUnreadDot /> : null}
              </NavLink>
            ))}
            {isOperator ? (
              <NavLink
                {...ADMIN_ENTRY}
                label={text(ADMIN_ENTRY.label)}
                active={adminSectionFrom(pathname) !== null}
                onNavigate={close}
              />
            ) : null}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {app ? (
        <nav aria-label={text("App sections")}>
          <SidebarGroup>
            <SidebarGroupLabel>
              <span>{text("App")}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {APP_SECTIONS.map(({ segment, label }) => {
                  const Icon = SECTION_ICONS[segment];
                  const active = isSectionActive(pathname, app.id, segment);
                  return (
                    <SidebarMenuItem key={segment || "overview"}>
                      <SidebarMenuButton
                        asChild
                        tooltip={text(label)}
                        isActive={active}
                      >
                        <Link
                          href={sectionHref(app.id, segment)}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon />
                          <span>{text(label)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      ) : null}
    </>
  );
}
