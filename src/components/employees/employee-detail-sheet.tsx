"use client";

import {
	Briefcase,
	CalendarDays,
	Mail,
	Building2,
	CreditCard,
	ClipboardCheck,
	Wallet,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, UserAvatar } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import { useEmployee } from "@/hooks/employee.hook";
import type { Employee } from "@/types/employee.type";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

interface EmployeeDetailSheetProps {
	employee: Employee | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-4 py-2">
			<span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
				{label}
			</span>
			<span className="text-right text-sm font-medium text-[#0F172A] dark:text-white">
				{value}
			</span>
		</div>
	);
}

export function EmployeeDetailSheet({
	employee,
	open,
	onOpenChange,
}: EmployeeDetailSheetProps) {
	const { data: detail, isLoading } = useEmployee(employee?.id ?? "");

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full gap-0 overflow-y-auto border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]"
			>
				<SheetHeader className="border-b border-[#E2E8F0] pb-4 dark:border-[#1E293B]">
					<SheetTitle className="text-base text-[#0F172A] dark:text-white">
						Employee details
					</SheetTitle>
					<SheetDescription className="text-xs">
						Profile, salary and activity overview
					</SheetDescription>
				</SheetHeader>

				{employee ? (
					<div className="space-y-5 p-5">
						<div className="flex items-center gap-4">
							<UserAvatar
								name={employee.user.name}
								src={employee.user.avatar}
								size="lg"
							/>
							<div className="min-w-0">
								<p className="truncate text-base font-semibold text-[#0F172A] dark:text-white">
									{employee.user.name}
								</p>
								<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
									{employee.jobTitle} · {employee.employeeCode}
								</p>
								<div className="mt-1.5">
									<StatusBadge status={employee.status} />
								</div>
							</div>
						</div>

						<div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-1 dark:border-[#1E293B] dark:bg-[#0B1120]">
							<Row
								label="Email"
								value={
									<a
										href={`mailto:${employee.user.email}`}
										className="text-[#2563EB] hover:underline dark:text-[#60A5FA]"
									>
										{employee.user.email}
									</a>
								}
							/>
							<Separator className="bg-[#E2E8F0] dark:bg-[#1E293B]" />
							<Row
								label="Department"
								value={employee.department?.name ?? "Unassigned"}
							/>
							<Separator className="bg-[#E2E8F0] dark:bg-[#1E293B]" />
							<Row
								label="Joining date"
								value={formatDate(employee.joiningDate)}
							/>
							<Separator className="bg-[#E2E8F0] dark:bg-[#1E293B]" />
							<Row
								label="Salary"
								value={
									employee.salaryType === "MONTHLY"
										? `$${(employee.salary ?? 0).toLocaleString()} / month`
										: `$${(employee.hourlyRate ?? 0).toFixed(2)} / hour`
								}
							/>
						</div>

						<div>
							<h3 className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
								Activity
							</h3>
							{isLoading || !detail ? (
								<div className="mt-3 grid grid-cols-2 gap-3">
									{Array.from({ length: 4 }).map((_, i) => (
										<Skeleton
											key={`stat-${i}`}
											className="h-16 rounded-md bg-[#F1F5F9] dark:bg-[#1E293B]"
										/>
									))}
								</div>
							) : (
								<div className="mt-3 grid grid-cols-2 gap-3">
									{[
										{
											label: "Tasks",
											value: detail._count.tasks,
											icon: ClipboardCheck,
										},
										{
											label: "Submissions",
											value: detail._count.submissions,
											icon: ClipboardCheck,
										},
										{
											label: "Payrolls",
											value: detail._count.payrolls,
											icon: Wallet,
										},
										{
											label: "Payments",
											value: detail._count.payments,
											icon: CreditCard,
										},
									].map((item) => (
										<div
											key={item.label}
											className="rounded-md border border-[#E2E8F0] bg-white p-3 dark:border-[#1E293B] dark:bg-[#0B1120]"
										>
											<div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
												<item.icon className="size-3.5" />
												<span className="text-[11px] font-medium">
													{item.label}
												</span>
											</div>
											<p className="mt-1 text-lg font-bold text-[#0F172A] dark:text-white">
												{item.value}
											</p>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="flex flex-wrap gap-4 border-t border-[#E2E8F0] pt-4 text-xs text-[#64748B] dark:border-[#1E293B] dark:text-[#94A3B8]">
							<span className="inline-flex items-center gap-1.5">
								<CalendarDays className="size-3.5" />
								Joined {formatDate(employee.joiningDate)}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Building2 className="size-3.5" />
								{employee.department?.name ?? "No department"}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Briefcase className="size-3.5" />
								{employee.jobTitle}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Mail className="size-3.5" />
								{employee.user.email}
							</span>
						</div>
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
