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
import { getSidebarRoutes } from "@/config/sidebar-routes";
import { useGetMe } from "@/hooks/auth.hook";
import type { SidebarItem } from "@/types/sidebar.type";
import { UserMenu } from "./user-menu";

function canView(item: SidebarItem, permissions: string[]): boolean {
  if (!item.permission && !item.anyOf) return true;
  if (item.permission && permissions.includes(item.permission)) return true;
  if (item.anyOf && item.anyOf.some((p) => permissions.includes(p))) return true;
  return false;
}

export function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { data: user } = useGetMe();
  const permissions = user?.permissions ?? [];

  const routes = getSidebarRoutes(role)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canView(item, permissions)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5 px-2 py-1.5">
          <Image
            src="/logo.png"
            alt="EmNex"
            width={28}
            height={28}
            className="size-7 object-contain"
          />
          {/* Sidebar is navy in both themes → white "Em" (theme.md §1) */}
          <span className="text-lg font-bold tracking-tight text-white">
            Em<span className="text-[#2563EB]">Nex</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.url ||
                    (item.url !== "/admin" &&
                      item.url !== "/manager" &&
                      item.url !== "/finance" &&
                      item.url !== "/dashboard" &&
                      pathname.startsWith(item.url));
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        // Active route: solid blue + white (theme.md §6 Command Sidebar)
                        className="data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground"
                      >
                        {/* Close the mobile drawer once a link is tapped */}
                        <Link href={item.url} onClick={() => setOpenMobile(false)}>
                          <Icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
