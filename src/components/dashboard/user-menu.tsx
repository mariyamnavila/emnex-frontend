"use client";

import Link from "next/link";
import { ChevronsUpDown, Globe, LogOut, User } from "lucide-react";
import { getHomePath, useCurrentUser, useLogout } from "@/hooks/auth.hook";
import { UserAvatar } from "@/components/shared";
import { formatRoleName } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function UserMenu() {
  const { isMobile } = useSidebar();
  const user = useCurrentUser();
  const logout = useLogout();
  const profileHref = `${getHomePath(user.role)}/profile`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={user.name}
              className="h-12 gap-2.5 rounded-lg bg-white/4 px-2 ring-1 ring-white/6 hover:bg-white/8 data-[state=open]:bg-white/8 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:ring-0"
            >
              <UserAvatar name={user.name} src={user.avatar} className="border-white/10" />
              <span className="grid min-w-0 flex-1 gap-0.5 text-left leading-tight">
                <span className="truncate text-[13px] font-semibold text-white">{user.name}</span>
                {user.role ? (
                  <span className="w-fit rounded-full bg-white/8 px-1.5 py-px text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
                    {formatRoleName(user.role)}
                  </span>
                ) : null}
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-[#64748B]" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={8}
            className="w-60 border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
          >
            <DropdownMenuLabel className="flex items-center gap-2.5 py-2 font-normal">
              <UserAvatar name={user.name} src={user.avatar} />
              <span className="grid min-w-0 leading-tight">
                <span className="truncate text-sm font-semibold text-[#0F172A] dark:text-white">
                  {user.name}
                </span>
                <span className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{user.email}</span>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2">
              <Link href={profileHref}>
                <User className="size-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-2">
              <Link href="/">
                <Globe className="size-4" />
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => logout.mutate()}
              disabled={logout.isPending}
              className="gap-2 text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626]"
            >
              <LogOut className="size-4" />
              {logout.isPending ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
