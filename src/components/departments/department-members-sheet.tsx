"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailSheet, EmptyState, PersonLine, SectionHeading, skeletonBone, StatusBadge } from "@/components/shared";
import { useDepartmentMembers } from "@/hooks/department.hook";
import type { Department } from "@/types/employee.type";

interface DepartmentMembersSheetProps {
	department: Department | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DepartmentMembersSheet({ department, open, onOpenChange }: DepartmentMembersSheetProps) {
	const { data: members = [], isLoading } = useDepartmentMembers(open ? (department?.id ?? null) : null);

	return (
		<DetailSheet
			open={open}
			onOpenChange={onOpenChange}
			title={department?.name}
			description={department?.description || "No description"}
		>
			<div>
				<div className="flex items-center justify-between">
					<SectionHeading>Members</SectionHeading>
					{!isLoading ? (
						<span className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">{members.length}</span>
					) : null}
				</div>

				{isLoading ? (
					<div className="mt-3 space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={`member-${i}`} className={`h-12 ${skeletonBone}`} />
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
							<li key={member.id} className="py-3">
								<PersonLine
									name={member.user.name}
									avatar={member.user.avatar}
									subtitle={member.jobTitle}
									trailing={<StatusBadge status={member.status} />}
								/>
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
		</DetailSheet>
	);
}
