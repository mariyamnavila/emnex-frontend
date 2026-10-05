"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { ClipboardCheck, CreditCard, ListTodo, UserCog, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DetailList,
	DetailRow,
	DetailSheet,
	SectionHeading,
	skeletonBone,
	StatusBadge,
	UserAvatar,
} from "@/components/shared";
import { formatDay } from "@/lib/utils";
import { formatCurrency, getPaySummary } from "@/lib/pay";
import { useEmployee } from "@/hooks/employee.hook";
import type { Employee } from "@/types/employee.type";

interface EmployeeDetailSheetProps {
	employee: Employee | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Omit to hide the button (no employee.update permission) */
	onChangeStatus?: (employee: Employee) => void;
}

// "Jul 15, 2025 · 1 year" — or "Starts Oct 20, 2026" for future hires
function joinedLabel(joiningDate: string): string {
	const date = new Date(joiningDate);
	if (date > new Date()) return `Starts ${formatDay(date)}`;
	return `${formatDay(date)} · ${formatDistanceToNowStrict(date)}`;
}

export function EmployeeDetailSheet({
	employee: listRow,
	open,
	onOpenChange,
	onChangeStatus,
}: EmployeeDetailSheetProps) {
	const { data: detail, isLoading } = useEmployee(listRow?.id ?? "");
	// List row shows instantly; the fresh record replaces it (e.g. after a status change)
	const employee = detail ?? listRow;

	const pay = employee ? getPaySummary(employee.salaryType, employee.salary, employee.hourlyRate) : null;

	return (
		<DetailSheet
			open={open}
			onOpenChange={onOpenChange}
			title="Employee profile"
			description="Position, compensation and activity"
		>
			{employee ? (
				<>
					{/* Identity */}
					<div className="flex items-start gap-4">
						<UserAvatar name={employee.user.name} src={employee.user.avatar} size="lg" />
						<div className="min-w-0 flex-1">
							<p className="truncate text-lg font-semibold tracking-tight text-[#0F172A] dark:text-white">
								{employee.user.name}
							</p>
							<p className="truncate text-sm text-[#64748B] dark:text-[#94A3B8]">{employee.jobTitle}</p>
							<div className="mt-2 flex flex-wrap items-center gap-2">
								<StatusBadge status={employee.status} />
								<span className="font-mono text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
									{employee.employeeCode}
								</span>
								{onChangeStatus ? (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => onChangeStatus(employee)}
										className="ml-auto h-7 gap-1.5 border-[#E2E8F0] px-2.5 text-xs text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
									>
										<UserCog className="size-3.5" />
										Change status
									</Button>
								) : null}
							</div>
						</div>
					</div>

					{/* Compensation */}
					<div className="rounded-lg border border-[#E2E8F0] p-4 dark:border-[#1E293B]">
						<div className="flex items-center justify-between">
							<SectionHeading>Compensation</SectionHeading>
							<span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
								{employee.salaryType === "MONTHLY" ? "Monthly salary" : "Hourly"}
							</span>
						</div>

						{pay ? (
							<>
								<p className="mt-3 tabular-nums">
									<span className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
										{formatCurrency(pay.rate)}
									</span>
									<span className="ml-1.5 text-sm text-[#64748B] dark:text-[#94A3B8]">/ {pay.unit}</span>
								</p>
								<dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[#F1F5F9] pt-3 dark:border-[#1E293B]">
									<div>
										<dt className="text-xs text-[#64748B] dark:text-[#94A3B8]">
											{pay.isEstimate ? "Est. monthly" : "Monthly"}
										</dt>
										<dd className="mt-0.5 text-sm font-semibold text-[#0F172A] tabular-nums dark:text-white">
											{formatCurrency(pay.monthly)}
										</dd>
									</div>
									<div>
										<dt className="text-xs text-[#64748B] dark:text-[#94A3B8]">
											{pay.isEstimate ? "Est. annual" : "Annual"}
										</dt>
										<dd className="mt-0.5 text-sm font-semibold text-[#0F172A] tabular-nums dark:text-white">
											{formatCurrency(pay.annual)}
										</dd>
									</div>
								</dl>
								{pay.isEstimate ? (
									<p className="mt-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
										Estimates assume 160 h/month. Payroll pays approved work hours × hourly rate.
									</p>
								) : null}
							</>
						) : (
							<p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">No pay rate set for this employee.</p>
						)}
					</div>

					{/* Details */}
					<div>
						<SectionHeading>Details</SectionHeading>
						<DetailList bordered={false} className="mt-1">
							<DetailRow variant="split" label="Email">
								<a
									href={`mailto:${employee.user.email}`}
									className="break-all text-[#2563EB] hover:underline dark:text-[#60A5FA]"
								>
									{employee.user.email}
								</a>
							</DetailRow>
							<DetailRow variant="split" label="Department">
								{employee.department?.name ?? "No department"}
							</DetailRow>
							<DetailRow variant="split" label="Joined">
								<span className="tabular-nums">{joinedLabel(employee.joiningDate)}</span>
							</DetailRow>
						</DetailList>
					</div>

					{/* Activity */}
					<div>
						<SectionHeading>Activity</SectionHeading>
						<div className="mt-3 grid grid-cols-2 gap-3">
							{isLoading || !detail
								? Array.from({ length: 4 }).map((_, i) => (
										<Skeleton key={`stat-${i}`} className={`h-17 rounded-md ${skeletonBone}`} />
									))
								: [
										{ label: "Tasks", value: detail._count.tasks, icon: ListTodo },
										{
											label: "Submissions",
											value: detail._count.submissions,
											icon: ClipboardCheck,
										},
										{ label: "Payrolls", value: detail._count.payrolls, icon: Wallet },
										{
											label: "Payments",
											value: detail._count.payments,
											icon: CreditCard,
										},
									].map((item) => (
										<div key={item.label} className="rounded-md border border-[#E2E8F0] p-3 dark:border-[#1E293B]">
											<div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
												<item.icon className="size-3.5" aria-hidden="true" />
												<span className="text-xs font-medium">{item.label}</span>
											</div>
											<p className="mt-1 text-xl font-bold text-[#0F172A] tabular-nums dark:text-white">{item.value}</p>
										</div>
									))}
						</div>
					</div>
				</>
			) : null}
		</DetailSheet>
	);
}
