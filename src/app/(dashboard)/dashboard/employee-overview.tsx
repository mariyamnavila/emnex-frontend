"use client";

import Link from "next/link";
import { AlertTriangle, Clock, Hourglass, ListTodo, Wallet } from "lucide-react";
import { ApexChart, DetailFigure, PageHeader, StatCard, StatusBadge } from "@/components/shared";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PayBreakdown } from "@/components/payroll/pay-breakdown";
import { TaskDue } from "@/components/tasks/task-due";
import { useCurrentUser } from "@/hooks/auth.hook";
import { useMyPayments } from "@/hooks/payment.hook";
import { useMyPayrolls } from "@/hooks/payroll.hook";
import { useMySubmissions } from "@/hooks/submission.hook";
import { useMyTasks } from "@/hooks/task.hook";
import { errorMessage } from "@/lib/api";
import { baseChartOptions, chartAxisLabelStyle } from "@/lib/chart-theme";
import { formatCurrency } from "@/lib/pay";
import { compareByUrgency, isTaskOverdue, OPEN_TASK_STATUSES } from "@/lib/task";
import { formatDay, formatMonth, timeAgo } from "@/lib/utils";
import type { MySubmission } from "@/types/submission.type";

const round = (value: number) => Math.round(value * 100) / 100;
const sumHours = (logs: MySubmission[]) => round(logs.reduce((total, log) => total + log.hoursWorked, 0));
const monthKey = (iso: string) => iso.slice(0, 7);

export function EmployeeOverview() {
	const { name } = useCurrentUser();
	const tasks = useMyTasks();
	const logs = useMySubmissions();
	const payrolls = useMyPayrolls();
	const payments = useMyPayments();

	const myTasks = tasks.data ?? [];
	const myLogs = logs.data ?? [];

	const openTasks = myTasks.filter((task) => OPEN_TASK_STATUSES.includes(task.status)).sort(compareByUrgency);
	const overdueCount = openTasks.filter(isTaskOverdue).length;

	const pendingLogs = myLogs.filter((log) => log.status === "PENDING");
	const approvedLogs = myLogs.filter((log) => log.status === "APPROVED");
	const thisMonth = new Date().toISOString().slice(0, 7);
	const approvedThisMonth = sumHours(approvedLogs.filter((log) => monthKey(log.workDate) === thisMonth));

	const lastPaid = (payments.data ?? []).find((payment) => payment.status === "COMPLETED");
	const latestPayroll = [...(payrolls.data ?? [])].sort((a, b) => b.periodStart.localeCompare(a.periodStart))[0];

	// Hours per month for the latest 6 months that have any logs
	const months = [...new Set(myLogs.map((log) => monthKey(log.workDate)))].sort().slice(-6);
	const hoursIn = (month: string, status: MySubmission["status"]) =>
		sumHours(myLogs.filter((log) => monthKey(log.workDate) === month && log.status === status));
	const chartOptions = baseChartOptions({
		chart: { stacked: true },
		colors: ["#16A34A", "#D97706"],
		plotOptions: { bar: { columnWidth: "45%", borderRadius: 4 } },
		xaxis: {
			categories: months.map((month) => formatMonth(`${month}-01`)),
			labels: { style: chartAxisLabelStyle },
			axisBorder: { color: "#E2E8F0" },
			axisTicks: { show: false },
		},
		yaxis: { labels: { style: chartAxisLabelStyle, formatter: (value: number) => `${Math.round(value)} h` } },
		grid: { borderColor: "#F1F5F9", strokeDashArray: 4 },
		legend: { position: "top", horizontalAlign: "right", labels: { colors: "#64748B" }, markers: { size: 4 } },
		tooltip: { theme: "light", y: { formatter: (value: number) => `${value} h` } },
	});

	// Suspended accounts can't see tasks or work logs; the API says why
	const blocked = tasks.error ?? logs.error;

	return (
		<div className="space-y-6">
			<PageHeader
				title={name ? `Welcome back, ${name.split(" ")[0]}` : "Dashboard"}
				description="Your tasks, the hours you've logged, and your pay."
			/>

			{blocked ? (
				<div className="flex items-start gap-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E] dark:border-[#78350F] dark:bg-[#451A03]/40 dark:text-[#FCD34D]">
					<AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					<p>
						{errorMessage(blocked, "Some of your work couldn't be loaded.")} Contact your HR manager if this looks
						wrong.
					</p>
				</div>
			) : null}

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Open tasks"
					isLoading={tasks.isLoading}
					value={tasks.isError ? "—" : openTasks.length}
					icon={ListTodo}
					hint={tasks.isError ? "Not available" : overdueCount > 0 ? `${overdueCount} overdue` : "None overdue"}
				/>
				<StatCard
					title="Waiting for review"
					isLoading={logs.isLoading}
					value={logs.isError ? "—" : pendingLogs.length}
					icon={Hourglass}
					hint={logs.isError ? "Not available" : `${sumHours(pendingLogs)} h logged`}
				/>
				<StatCard
					title="Hours approved"
					isLoading={logs.isLoading}
					value={logs.isError ? "—" : `${sumHours(approvedLogs)} h`}
					icon={Clock}
					hint={logs.isError ? "Not available" : `${approvedThisMonth} h this month`}
				/>
				<StatCard
					title="Last paid"
					isLoading={payments.isLoading}
					value={lastPaid ? formatCurrency(lastPaid.amount) : "—"}
					icon={Wallet}
					hint={lastPaid ? `${formatMonth(lastPaid.payroll.periodStart)} payroll` : "No payments yet"}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<ChartCard
					title="My open tasks"
					description="Overdue first, then by due date"
					isLoading={tasks.isLoading}
					isError={tasks.isError}
					isEmpty={openTasks.length === 0}
					emptyText="Nothing on your plate right now."
					className="lg:col-span-2"
					action={
						<Link href="/dashboard/tasks" className="text-xs font-medium text-[#2563EB] hover:underline dark:text-[#60A5FA]">
							View all
						</Link>
					}
				>
					<ul className="divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
						{openTasks.slice(0, 5).map((task) => {
							return (
								<li key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-[#0F172A] dark:text-white">{task.title}</p>
										<p className="flex flex-wrap items-center gap-x-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
											<span className="truncate">{task.project.name}</span>
											<TaskDue task={task} verbose />
										</p>
									</div>
									<StatusBadge status={task.status} />
								</li>
							);
						})}
					</ul>
					{openTasks.length > 5 ? (
						<p className="mt-3 text-xs text-[#64748B] dark:text-[#94A3B8]">+{openTasks.length - 5} more open tasks</p>
					) : null}
				</ChartCard>

				<ChartCard
					title="Latest payroll"
					description={
						latestPayroll ? `${formatMonth(latestPayroll.periodStart)} pay period` : "Your most recent payslip"
					}
					isLoading={payrolls.isLoading}
					isError={payrolls.isError}
					isEmpty={!latestPayroll}
					emptyText="No payroll generated for you yet."
				>
					{latestPayroll ? (
						<div className="space-y-4">
							<DetailFigure
								value={formatCurrency(latestPayroll.netAmount)}
								caption={
									<span className="inline-flex items-center gap-2">
										Net pay <StatusBadge status={latestPayroll.status} />
									</span>
								}
							/>
							<PayBreakdown
								grossAmount={latestPayroll.grossAmount}
								deductions={latestPayroll.deductions}
								netAmount={latestPayroll.netAmount}
							/>
							<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
								{latestPayroll.payment?.status === "COMPLETED"
									? "Paid through Stripe."
									: latestPayroll.status === "APPROVED"
										? "Approved — waiting to be paid."
										: latestPayroll.status === "REJECTED"
											? "This payroll was rejected."
											: "Waiting for finance approval."}
							</p>
						</div>
					) : null}
				</ChartCard>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<ChartCard
					title="Hours by month"
					description="Approved and still waiting for review"
					isLoading={logs.isLoading}
					isError={logs.isError}
					isEmpty={months.length === 0}
					emptyText="Log hours on a task to see them here."
					className="lg:col-span-2"
				>
					<ApexChart
						type="bar"
						height={280}
						options={chartOptions}
						series={[
							{ name: "Approved", data: months.map((month) => hoursIn(month, "APPROVED")) },
							{ name: "Waiting for review", data: months.map((month) => hoursIn(month, "PENDING")) },
						]}
					/>
				</ChartCard>

				<ChartCard
					title="Recent work logs"
					description="Your latest submitted hours"
					isLoading={logs.isLoading}
					isError={logs.isError}
					isEmpty={myLogs.length === 0}
					emptyText="You haven't logged any hours yet."
				>
					<ul className="divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
						{myLogs.slice(0, 5).map((log) => (
							<li key={log.id} className="space-y-1 py-2.5 first:pt-0 last:pb-0">
								<div className="flex items-center justify-between gap-3">
									<p className="min-w-0 truncate text-sm font-medium text-[#0F172A] dark:text-white">
										{log.task.title}
									</p>
									<span className="shrink-0 text-sm font-semibold text-[#0F172A] tabular-nums dark:text-white">
										{log.hoursWorked} h
									</span>
								</div>
								<div className="flex items-center justify-between gap-3">
									<p className="truncate text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
										{formatDay(log.workDate)} · {timeAgo(log.createdAt)}
									</p>
									<StatusBadge status={log.status} />
								</div>
								{log.status === "REJECTED" && log.reviewNote ? (
									<p className="line-clamp-2 text-xs text-[#B91C1C] dark:text-[#FCA5A5]">“{log.reviewNote}”</p>
								) : null}
							</li>
						))}
					</ul>
				</ChartCard>
			</div>
		</div>
	);
}
