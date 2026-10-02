"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { EmptyState, StatusBadge, UserAvatar } from "@/components/shared";
import { useDepartmentMembers } from "@/hooks/department.hook";
import type { Department } from "@/types/employee.type";

interface DepartmentMembersSheetProps {
	department: Department | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DepartmentMembersSheet({
	department,
	open,
	onOpenChange,
}: DepartmentMembersSheetProps) {
	const { data: members = [], isLoading } = useDepartmentMembers(
		open ? (department?.id ?? null) : null,
	);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full gap-0 overflow-y-auto border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]"
			>
				<SheetHeader className="border-b border-[#E2E8F0] pb-4 dark:border-[#1E293B]">
					<SheetTitle className="text-base text-[#0F172A] dark:text-white">
						{department?.name}
					</SheetTitle>
					<SheetDescription className="text-xs">
						{department?.description || "No description"}
					</SheetDescription>
				</SheetHeader>

				<div className="p-5">
					<div className="flex items-center justify-between">
						<h3 className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
							Members
						</h3>
						{!isLoading ? (
							<span className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
								{members.length}
							</span>
						) : null}
					</div>

					{isLoading ? (
						<div className="mt-3 space-y-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={`member-${i}`} className="h-12 bg-[#F1F5F9] dark:bg-[#1E293B]" />
							))}
						</div>
					) : members.length === 0 ? (
						<EmptyState
							icon={Users}
							title="No members yet"
							description="Assign employees to this department from their profile or when creating them."
							className="py-10"
						/>
					) : (
						<ul className="mt-2 divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
							{members.map((member) => (
								<li key={member.id} className="flex items-center gap-3 py-3">
									<UserAvatar name={member.user.name} src={member.user.avatar} />
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-[#0F172A] dark:text-white">
											{member.user.name}
										</p>
										<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
											{member.jobTitle}
										</p>
									</div>
									<StatusBadge status={member.status} />
								</li>
							))}
						</ul>
					)}

					{department && members.length > 0 ? (
						<Button
							asChild
							variant="outline"
							className="mt-4 w-full border-[#E2E8F0] text-sm text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
						>
							<Link href={`/admin/employees?departmentId=${department.id}`}>
								View in employees
								<ArrowRight className="size-4" />
							</Link>
						</Button>
					) : null}
				</div>
			</SheetContent>
		</Sheet>
	);
}
