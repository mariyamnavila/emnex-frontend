"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  canViewItem,
  firstAccessibleHref,
  getSidebarRoutes,
  isSystemRole,
} from "@/config/sidebar-routes";
import { getHomePath, useCurrentUser } from "@/hooks/auth.hook";
import { UserMenu } from "./user-menu";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { role, permissions, organizationName } = useCurrentUser();
  // System roles have a fixed home; custom roles land on their first allowed page
  const home = isSystemRole(role)
    ? getHomePath(role)
    : (firstAccessibleHref(role, permissions) ?? "/dashboard/profile");

  const routes = getSidebarRoutes(role, permissions)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canViewItem(item, permissions)),
    }))
    .filter((group) => group.items.length > 0);

  // Section home (/admin) is active only on itself; other items also on their sub-pages
  const isActive = (url: string) =>
    pathname === url || (url !== home && pathname.startsWith(`${url}/`));

  return (
    <Sidebar collapsible="icon" className="group-data-[side=left]:border-r-0">
      <SidebarHeader className="h-14 justify-center border-b border-white/6 px-3 group-data-[collapsible=icon]:px-2">
        <Link
          href={home}
          className="flex items-center gap-2.5 overflow-hidden rounded-md p-1 outline-none group-data-[collapsible=icon]:p-0 focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/6 ring-1 ring-white/10">
            <Image src="/logo.png" alt="EmNex" width={20} height={20} className="size-5 object-contain" priority />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block text-[15px] leading-tight font-bold tracking-tight text-white">
              Em<span className="text-[#3B82F6]">Nex</span>
            </span>
            {organizationName ? (
              <span className="block truncate text-[11px] text-[#94A3B8]">{organizationName}</span>
            ) : (
              <Skeleton className="mt-1 h-2.5 w-20 bg-white/7" />
            )}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-2 py-3">
        {permissions === null ? (
          // /auth/me not loaded yet: show a nav skeleton instead of flashing
          // every link (permissions filter them once they arrive)
          [4, 3].map((count, groupIndex) => (
            <SidebarGroup
              key={`nav-skeleton-${groupIndex}`}
              className="px-1 py-1.5 group-data-[collapsible=icon]:px-0"
            >
              <div className="px-2 py-1.5">
                <Skeleton className="h-2.5 w-16 bg-white/10" />
              </div>
              <SidebarGroupContent>
                <div className="space-y-1 px-1">
                  {Array.from({ length: count }).map((_, i) => (
                    <Skeleton key={i} className="h-9 rounded-md bg-white/7" />
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        ) : (
          routes.map((group) => (
          <SidebarGroup key={group.title} className="px-1 py-1.5 group-data-[collapsible=icon]:px-0">
            <SidebarGroupLabel className="h-7 px-2 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        tooltip={item.title}
                        className="h-9 gap-3 rounded-md px-2.5 text-[13px] font-medium text-[#CBD5E1] transition-colors hover:bg-white/6 hover:text-white data-active:bg-[#2563EB] data-active:text-white data-active:shadow-[0_1px_2px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.12)] [&>svg]:text-[#94A3B8] hover:[&>svg]:text-white data-active:[&>svg]:text-white"
                      >
                        <Link href={item.url} onClick={() => setOpenMobile(false)}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          ))
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/6 p-3 group-data-[collapsible=icon]:p-2">
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
