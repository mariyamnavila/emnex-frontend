"use client";

import Link from "next/link";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
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

export function UserMenu() {
  const { data: user } = useGetMe();
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 w-full justify-start gap-2 px-2"
        >
          <UserAvatar name={user?.name ?? ""} src={user?.avatar} />
          <div className="flex flex-col items-start overflow-hidden">
            <span className="truncate text-sm font-medium text-[#0F172A] dark:text-white">
              {user?.name}
            </span>
            <span className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
              {user?.role?.name?.replace(/_/g, " ")}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-56">
        <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/profile">
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
