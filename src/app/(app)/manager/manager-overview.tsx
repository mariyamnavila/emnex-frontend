"use client";

import { Building2, ClipboardCheck, Clock, Users } from "lucide-react";
import { ApexChart, PageHeader, StatCard } from "@/components/shared";
import { ChartCard } from "@/components/dashboard/chart-card";
import { HeadcountChart } from "@/components/dashboard/headcount-chart";
import { ReviewQueue } from "@/components/submissions/review-queue";
import { useManagerDashboard } from "@/hooks/analytics.hook";
import { statusDonutOptions } from "@/lib/chart-theme";
import { plural } from "@/lib/utils";


export function ManagerOverview() {
	const { data: stats, isLoading, isError } = useManagerDashboard();
	const team = stats?.employeeByStatus ?? [];

	return (
		<div className="space-y-6">
			<PageHeader title="Overview" description="Review your team's work logs and keep an eye on headcount." />

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Pending reviews"
					isLoading={isLoading}
					value={stats?.pendingSubmissions ?? 0}
					icon={ClipboardCheck}
					hint={stats ? `${stats.pendingHours} h awaiting approval` : undefined}
				/>
				<StatCard
					title="Hours approved"
					isLoading={isLoading}
					value={`${stats?.approvedHoursThisMonth ?? 0} h`}
					icon={Clock}
					hint="This month"
				/>
				<StatCard
					title="Active employees"
					isLoading={isLoading}
					value={stats?.activeEmployees ?? 0}
					icon={Users}
					hint={stats ? `of ${stats.totalEmployees} total` : undefined}
				/>
				<StatCard
					title="Departments"
					isLoading={isLoading}
					value={stats?.totalDepartments ?? 0}
					icon={Building2}
					hint={stats ? `${plural(stats.newEmployeesThisMonth, "new hire")} this month` : undefined}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<ReviewQueue className="lg:col-span-2" />

				<ChartCard
					title="Team by status"
					description="Who can take on work right now"
					isLoading={isLoading}
					isError={isError}
					isEmpty={team.length === 0}
					emptyText="No employees yet."
				>
					<ApexChart
						type="donut"
						height={260}
						options={statusDonutOptions(
							team.map((item) => item.status),
							"Employees",
						)}
						series={team.map((item) => item._count)}
					/>
				</ChartCard>

				<HeadcountChart className="lg:col-span-3" />
			</div>
		</div>
	);
}
