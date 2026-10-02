"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { ClipboardCheck, CreditCard, ListTodo, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, UserAvatar } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import { formatCurrency, getPaySummary } from "@/lib/pay";
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

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
			{children}
		</h3>
	);
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4 py-2.5">
			<dt className="text-sm text-[#64748B] dark:text-[#94A3B8]">{label}</dt>
			<dd className="min-w-0 text-right text-sm font-medium text-[#0F172A] dark:text-white">
				{value}
			</dd>
		</div>
	);
}

// "Jul 15, 2025 · 1 year" — or "Starts Oct 20, 2026" for future hires
function joinedLabel(joiningDate: string): string {
	const date = new Date(joiningDate);
	if (date > new Date()) return `Starts ${formatDate(date)}`;
	return `${formatDate(date)} · ${formatDistanceToNowStrict(date)}`;
}

export function EmployeeDetailSheet({
	employee,
	open,
	onOpenChange,
}: EmployeeDetailSheetProps) {
	// The list row is shown instantly; the detail call adds activity counts
	const { data: detail, isLoading } = useEmployee(employee?.id ?? "");

	const pay = employee
		? getPaySummary(employee.salaryType, employee.salary, employee.hourlyRate)
		: null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full gap-0 overflow-y-auto border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]"
			>
				<SheetHeader className="border-b border-[#E2E8F0] pb-4 dark:border-[#1E293B]">
					<SheetTitle className="text-base text-[#0F172A] dark:text-white">
						Employee profile
					</SheetTitle>
					<SheetDescription className="text-xs">
						Position, compensation and activity
					</SheetDescription>
				</SheetHeader>

				{employee ? (
					<div className="space-y-6 p-5">
						{/* Identity */}
						<div className="flex items-start gap-4">
							<UserAvatar
								name={employee.user.name}
								src={employee.user.avatar}
								size="lg"
							/>
							<div className="min-w-0 flex-1">
								<p className="truncate text-lg font-semibold tracking-tight text-[#0F172A] dark:text-white">
									{employee.user.name}
								</p>
								<p className="truncate text-sm text-[#64748B] dark:text-[#94A3B8]">
									{employee.jobTitle}
								</p>
								<div className="mt-2 flex items-center gap-2">
									<StatusBadge status={employee.status} />
									<span className="font-mono text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
										{employee.employeeCode}
									</span>
								</div>
							</div>
						</div>

						{/* Compensation */}
						<div className="rounded-lg border border-[#E2E8F0] p-4 dark:border-[#1E293B]">
							<div className="flex items-center justify-between">
								<SectionTitle>Compensation</SectionTitle>
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
										<span className="ml-1.5 text-sm text-[#64748B] dark:text-[#94A3B8]">
											/ {pay.unit}
										</span>
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
											Estimates assume 160 h/month. Payroll pays approved work
											hours × hourly rate.
										</p>
									) : null}
								</>
							) : (
								<p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
									No pay rate set for this employee.
								</p>
							)}
						</div>

						{/* Details */}
						<div>
							<SectionTitle>Details</SectionTitle>
							<dl className="mt-1 divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
								<DetailRow
									label="Email"
									value={
										<a
											href={`mailto:${employee.user.email}`}
											className="break-all text-[#2563EB] hover:underline dark:text-[#60A5FA]"
										>
											{employee.user.email}
										</a>
									}
								/>
								<DetailRow
									label="Department"
									value={employee.department?.name ?? "No department"}
								/>
								<DetailRow
									label="Joined"
									value={
										<span className="tabular-nums">
											{joinedLabel(employee.joiningDate)}
										</span>
									}
								/>
							</dl>
						</div>

						{/* Activity */}
						<div>
							<SectionTitle>Activity</SectionTitle>
							<div className="mt-3 grid grid-cols-2 gap-3">
								{isLoading || !detail
									? Array.from({ length: 4 }).map((_, i) => (
											<Skeleton
												key={`stat-${i}`}
												className="h-17 rounded-md bg-[#F1F5F9] dark:bg-[#1E293B]"
											/>
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
											<div
												key={item.label}
												className="rounded-md border border-[#E2E8F0] p-3 dark:border-[#1E293B]"
											>
												<div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
													<item.icon className="size-3.5" aria-hidden="true" />
													<span className="text-xs font-medium">{item.label}</span>
												</div>
												<p className="mt-1 text-xl font-bold text-[#0F172A] tabular-nums dark:text-white">
													{item.value}
												</p>
											</div>
										))}
							</div>
						</div>
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
