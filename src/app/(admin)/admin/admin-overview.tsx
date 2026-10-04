"use client";

import { ClipboardCheck, FolderKanban, Users, Wallet } from "lucide-react";
import {
	ApexChart,
	PageHeader,
	StatCard,
} from "@/components/shared";
import { ChartCard } from "@/components/dashboard/chart-card";
import { HeadcountChart } from "@/components/dashboard/headcount-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
	useAdminDashboard,
	usePayrollAnalytics,
	useProjectAnalytics,
} from "@/hooks/analytics.hook";
import {
	baseChartOptions,
	chartAxisLabelStyle,
	statusDonutOptions,
} from "@/lib/chart-theme";
import { formatCompactCurrency, formatCurrency } from "@/lib/pay";

// Payroll periods are stored as UTC midnight — format in UTC so "Jan" never shows as "Dec"
const formatPeriod = (iso: string) =>
	new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});

export function AdminOverview() {
	const dashboard = useAdminDashboard();
	const payroll = usePayrollAnalytics();
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

	return (
		<div className="space-y-6">
			<PageHeader
				title="Overview"
				description="Workforce, projects and payroll across your organization."
			/>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Active employees"
					isLoading={dashboard.isLoading}
					value={statValue(stats?.activeEmployees)}
					icon={Users}
					hint={stats ? `of ${stats.totalEmployees} total` : undefined}
				/>
				<StatCard
					title="Active projects"
					isLoading={dashboard.isLoading}
					value={statValue(stats?.activeProjects)}
					icon={FolderKanban}
					hint="Currently in progress"
				/>
				<StatCard
					title="Pending reviews"
					isLoading={dashboard.isLoading}
					value={statValue(stats?.pendingSubmissions)}
					icon={ClipboardCheck}
					hint="Work submissions to approve"
				/>
				<StatCard
					title="Total payroll"
					isLoading={dashboard.isLoading}
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
						options={statusDonutOptions(
							payrollStatuses.map((item) => item.status),
							"Payrolls",
						)}
						series={payrollStatuses.map((item) => item._count)}
					/>
				</ChartCard>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<HeadcountChart />

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
						options={statusDonutOptions(
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
