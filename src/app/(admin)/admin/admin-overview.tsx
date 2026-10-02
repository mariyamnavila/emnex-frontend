"use client";

import type { ApexOptions } from "apexcharts";
import { ClipboardCheck, FolderKanban, Users, Wallet } from "lucide-react";
import {
	ApexChart,
	formatStatus,
	PageHeader,
	StatCard,
} from "@/components/shared";
import { ChartCard } from "@/components/dashboard/chart-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
	useAdminDashboard,
	usePayrollAnalytics,
	useProjectAnalytics,
} from "@/hooks/analytics.hook";
import { useEmployeeAnalytics } from "@/hooks/employee.hook";
import {
	baseChartOptions,
	chartAxisLabelStyle,
	STATUS_CHART_COLORS,
} from "@/lib/chart-theme";
import { formatCompactCurrency, formatCurrency } from "@/lib/pay";

// Payroll periods are stored as UTC midnight — format in UTC so "Jan" never shows as "Dec"
const formatPeriod = (iso: string) =>
	new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});

function donutOptions(statuses: string[], totalLabel: string): ApexOptions {
	return baseChartOptions({
		labels: statuses.map(formatStatus),
		colors: statuses.map((status) => STATUS_CHART_COLORS[status] ?? "#64748B"),
		legend: {
			position: "bottom",
			labels: { colors: "#64748B" },
			markers: { size: 4 },
		},
		stroke: { width: 2, colors: ["#FFFFFF"] },
		plotOptions: {
			pie: {
				donut: {
					size: "68%",
					labels: {
						show: true,
						total: {
							show: true,
							label: totalLabel,
							color: "#64748B",
							fontSize: "12px",
						},
						value: { color: "#0F172A", fontSize: "22px", fontWeight: 700 },
					},
				},
			},
		},
	});
}

export function AdminOverview() {
	const dashboard = useAdminDashboard();
	const payroll = usePayrollAnalytics();
	const employees = useEmployeeAnalytics();
	const projects = useProjectAnalytics();

	const stats = dashboard.data;
	const statValue = (value: number | undefined, format?: (n: number) => string) => {
		if (value === undefined) return "—";
		return format ? format(value) : value;
	};

	const trend = [...(payroll.data?.monthlyTrend ?? [])].reverse();
	const trendOptions = baseChartOptions({
		plotOptions: { bar: { columnWidth: "45%", borderRadius: 4 } },
		xaxis: {
			categories: trend.map((item) => formatPeriod(item.period)),
			labels: { style: chartAxisLabelStyle },
			axisBorder: { color: "#E2E8F0" },
			axisTicks: { show: false },
		},
		yaxis: {
			labels: { style: chartAxisLabelStyle, formatter: formatCompactCurrency },
		},
		grid: { borderColor: "#F1F5F9", strokeDashArray: 4 },
		tooltip: { theme: "light", y: { formatter: formatCurrency } },
	});

	const payrollStatuses = payroll.data?.byStatus ?? [];
	const projectStatuses = projects.data?.byStatus ?? [];
	const departments = employees.data?.byDepartment ?? [];

	const departmentOptions = baseChartOptions({
		plotOptions: { bar: { horizontal: true, barHeight: "55%", borderRadius: 4 } },
		xaxis: {
			categories: departments.map((item) => item.department),
			labels: { style: chartAxisLabelStyle },
			axisBorder: { show: false },
			axisTicks: { show: false },
			tickAmount: Math.max(1, ...departments.map((item) => item.count)),
		},
		yaxis: { labels: { style: chartAxisLabelStyle } },
		grid: { borderColor: "#F1F5F9", strokeDashArray: 4 },
		tooltip: { theme: "light", y: { formatter: (value: number) => `${value} employees` } },
	});

	return (
		<div className="space-y-6">
			<PageHeader
				title="Overview"
				description="Workforce, projects and payroll across your organization."
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Active employees"
					value={statValue(stats?.activeEmployees)}
					icon={Users}
					hint={stats ? `of ${stats.totalEmployees} total` : undefined}
				/>
				<StatCard
					title="Active projects"
					value={statValue(stats?.activeProjects)}
					icon={FolderKanban}
					hint="Currently in progress"
				/>
				<StatCard
					title="Pending reviews"
					value={statValue(stats?.pendingSubmissions)}
					icon={ClipboardCheck}
					hint="Work submissions to approve"
				/>
				<StatCard
					title="Total payroll"
					value={statValue(stats?.totalPayroll, formatCurrency)}
					icon={Wallet}
					hint={stats ? `${stats.pendingPayroll} awaiting approval` : undefined}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<ChartCard
					title="Payroll trend"
					description="Net payroll per period (last 6)"
					isLoading={payroll.isLoading}
					isError={payroll.isError}
					isEmpty={trend.length === 0}
					emptyText="No payroll generated yet."
					className="lg:col-span-2"
				>
					<ApexChart
						type="bar"
						height={280}
						options={trendOptions}
						series={[{ name: "Net payroll", data: trend.map((item) => item.total) }]}
					/>
				</ChartCard>

				<ChartCard
					title="Payroll by status"
					description="Where each payroll record stands"
					isLoading={payroll.isLoading}
					isError={payroll.isError}
					isEmpty={payrollStatuses.length === 0}
					emptyText="No payroll records yet."
				>
					<ApexChart
						type="donut"
						height={280}
						options={donutOptions(
							payrollStatuses.map((item) => item.status),
							"Payrolls",
						)}
						series={payrollStatuses.map((item) => item._count)}
					/>
				</ChartCard>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<ChartCard
					title="Headcount by department"
					isLoading={employees.isLoading}
					isError={employees.isError}
					isEmpty={departments.length === 0}
					emptyText="No departments yet."
				>
					<ApexChart
						type="bar"
						height={260}
						options={departmentOptions}
						series={[{ name: "Employees", data: departments.map((item) => item.count) }]}
					/>
				</ChartCard>

				<ChartCard
					title="Projects by status"
					isLoading={projects.isLoading}
					isError={projects.isError}
					isEmpty={projectStatuses.length === 0}
					emptyText="No projects yet."
				>
					<ApexChart
						type="donut"
						height={260}
						options={donutOptions(
							projectStatuses.map((item) => item.status),
							"Projects",
						)}
						series={projectStatuses.map((item) => item._count)}
					/>
				</ChartCard>

				<RecentActivity />
			</div>
		</div>
	);
}
