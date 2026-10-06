"use client";

import { ClipboardCheck, FolderKanban, Users, Wallet } from "lucide-react";
import {
	ApexChart,
	PageHeader,
	StatCard,
} from "@/components/shared";
import { ChartCard } from "@/components/dashboard/chart-card";
import { HeadcountChart } from "@/components/dashboard/headcount-chart";
import { PayrollStatusChart, PayrollTrendChart } from "@/components/dashboard/payroll-charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { useAdminDashboard, useProjectAnalytics } from "@/hooks/analytics.hook";
import { statusDonutOptions } from "@/lib/chart-theme";
import { formatCurrency } from "@/lib/pay";

export function AdminOverview() {
	const dashboard = useAdminDashboard();
	const projects = useProjectAnalytics();

	const stats = dashboard.data;
	const statValue = (value: number | undefined, format?: (n: number) => string) => {
		if (value === undefined) return "—";
		return format ? format(value) : value;
	};

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
					hint="Work hours to approve"
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
				<PayrollTrendChart className="lg:col-span-2" />
				<PayrollStatusChart />
			</div>

			<div className="grid items-start gap-4 lg:grid-cols-3">
				<HeadcountChart className="lg:col-span-2" />

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
			</div>

			<RecentActivity />
		</div>
	);
}
