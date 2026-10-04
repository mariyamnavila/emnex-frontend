"use client";

import { ApexChart } from "@/components/shared";
import { useEmployeeAnalytics } from "@/hooks/employee.hook";
import { baseChartOptions, chartAxisLabelStyle } from "@/lib/chart-theme";
import { ChartCard } from "./chart-card";

export function HeadcountChart({ className }: { className?: string }) {
	const { data, isLoading, isError } = useEmployeeAnalytics();
	const departments = data?.byDepartment ?? [];

	const options = baseChartOptions({
		plotOptions: { bar: { horizontal: true, barHeight: "55%", borderRadius: 4 } },
		xaxis: {
			categories: departments.map((item) => item.department),
			labels: { style: chartAxisLabelStyle, formatter: (value: string) => String(Math.round(Number(value))) },
			axisBorder: { show: false },
			axisTicks: { show: false },
			tickAmount: Math.max(1, ...departments.map((item) => item.count)),
		},
		yaxis: { labels: { style: chartAxisLabelStyle } },
		grid: { borderColor: "#F1F5F9", strokeDashArray: 4 },
		tooltip: { theme: "light", y: { formatter: (value: number) => `${value} employees` } },
	});

	return (
		<ChartCard
			title="Headcount by department"
			isLoading={isLoading}
			isError={isError}
			isEmpty={departments.length === 0}
			emptyText="No departments yet."
			className={className}
		>
			<ApexChart
				type="bar"
				height={260}
				options={options}
				series={[{ name: "Employees", data: departments.map((item) => item.count) }]}
			/>
		</ChartCard>
	);
}
