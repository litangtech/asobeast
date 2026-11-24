"use client";

import { useUiLanguage, UiText } from "@/components/language/UiLanguage";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, Plus } from "lucide-react";
import type { AppListItem } from "@asobeast/shared";
import { AppIcon } from "@/components/AppIcon";
import { ImportAppDialog } from "@/components/apps/ImportAppDialog";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  appRouteFrom,
  equivalentSection,
  sectionHref,
} from "@/lib/app-sections";
import { storeLabel } from "@/lib/format";
import { appsOptions } from "@/lib/queries";
import { switcherSubtitle } from "./app-switcher-label";

function appMarket(app: AppListItem): string {
  return `${storeLabel(app.store)} · ${app.country.toUpperCase()}`;
}

function TriggerLabel({
  current,
  subtitle,
}: {
  current: AppListItem | undefined;
  subtitle: string;
}) {
  const { text } = useUiLanguage();
  return (
    <>
      {current ? (
        <AppIcon src={current.iconUrl} name={current.name} size={24} />
      ) : (
        <span
          aria-hidden
          className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-caption font-medium"
        >
          ⌘
        </span>
      )}
      <span className="grid min-w-0 flex-1 text-left leading-tight">
        <span className="truncate font-medium">
          {current ? (current.name ?? text("Untitled app")) : text("All apps")}
        </span>
        <span className="truncate text-caption text-muted-foreground">
          {current ? appMarket(current) : subtitle}
        </span>
      </span>
      <ChevronsUpDown className="ml-auto" />
    </>
  );
}

function ImportEntry() {
  const { text } = useUiLanguage();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ImportAppDialog>
          <SidebarMenuButton size="lg" tooltip={text("Import app")}>
            <Plus />
            <span className="font-medium">
              <UiText message="Import app" />
            </span>
          </SidebarMenuButton>
        </ImportAppDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSwitcher() {
  const { text: uiLabel } = useUiLanguage();
  const { language, text } = useUiLanguage();
  const appLabel = (app: AppListItem) => app.name ?? text("Untitled app");
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: apps, isPending, isError } = useQuery(appsOptions);

  const route = appRouteFrom(pathname);
  const current = route ? apps?.find((app) => app.id === route.id) : undefined;

  function select(appId: string) {
    setOpen(false);
    if (isMobile) setOpenMobile(false);
    router.push(sectionHref(appId, equivalentSection(route?.segment ?? "")));
  }

  if (!isPending && apps?.length === 0) return <ImportEntry />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              ref={trigger}
              size="lg"
              aria-label={
                current
                  ? language === "zh-CN"
                    ? `切换应用，当前为 ${appLabel(current)}`
                    : uiLabel("Switch app, currently {0}", [appLabel(current)])
                  : text("Choose an app")
              }
              tooltip={
                current
                  ? (current.name ?? text("Untitled app"))
                  : text("All apps")
              }
              className="data-[state=open]:bg-sidebar-accent"
            >
              <TriggerLabel
                current={current}
                subtitle={switcherSubtitle(apps, isError)}
              />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            aria-label={text("Switch app")}
            side={isMobile ? "bottom" : "right"}
            className="w-72 p-0"
          >
            <Command>
              <CommandInput placeholder={text("Search apps…")} />
              <CommandList>
                <CommandEmpty>
                  <UiText message="No apps match." />
                </CommandEmpty>
                <CommandGroup heading={text("Apps")}>
                  {(apps ?? []).map((app) => (
                    <CommandItem
                      key={app.id}
                      value={`${appLabel(app)} ${appMarket(app)}`}
                      onSelect={() => select(app.id)}
                    >
                      <AppIcon src={app.iconUrl} name={app.name} size={20} />
                      <span className="truncate">{appLabel(app)}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {storeLabel(app.store)}
                      </Badge>
                      <Badge variant="outline">
                        {app.country.toUpperCase()}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value="import app"
                    onSelect={() => {
                      setOpen(false);
                      setImporting(true);
                    }}
                  >
                    <Plus />
                    <UiText message="Import app" />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <ImportAppDialog
          open={importing}
          onOpenChange={setImporting}
          returnFocus={trigger}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
