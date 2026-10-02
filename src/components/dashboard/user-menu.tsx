"use client";

import Link from "next/link";
import { getHomePath, useGetMe, useLogout } from "@/hooks/auth.hook";
import { UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

// Profile dock at the bottom of the (navy) sidebar
export function UserMenu() {
  const { data: user } = useGetMe();
  const logout = useLogout();

  const role = user?.role?.name ?? "";
  // Each role has its own profile page: /admin/profile, /manager/profile, ...
  const profileHref = `${getHomePath(role)}/profile`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 w-full justify-start gap-2 px-2 hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
        >
          <UserAvatar name={user?.name ?? ""} src={user?.avatar} />
          <div className="flex min-w-0 flex-col items-start gap-0.5">
            <span className="w-full truncate text-left text-sm font-medium text-white">
              {user?.name}
            </span>
            {/* Role indicator pill (theme.md §6) */}
            {role ? (
              <span className="rounded-full border border-[#334155] px-1.5 text-[10px] leading-4 font-semibold tracking-wider text-[#94A3B8] uppercase">
                {role.replace(/_/g, " ")}
              </span>
            ) : null}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-56">
        <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={profileHref}>
            <User className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => logout.mutate()}
          disabled={logout.isPending}
          className="text-[#DC2626] focus:text-[#DC2626]"
        >
          <LogOut className="size-4" />
          {logout.isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
