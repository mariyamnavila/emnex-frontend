"use client";

import { ApexChart } from "@/components/shared";
import { usePayrollAnalytics } from "@/hooks/analytics.hook";
import { baseChartOptions, chartAxisLabelStyle, statusDonutOptions } from "@/lib/chart-theme";
import { formatCompactCurrency, formatCurrency } from "@/lib/pay";
import { ChartCard } from "./chart-card";

// Payroll periods are stored as UTC midnight — format in UTC so "Jan" never shows as "Dec"
const formatPeriod = (iso: string) =>
	new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export function PayrollTrendChart({ className }: { className?: string }) {
	const { data, isLoading, isError } = usePayrollAnalytics();
	const trend = [...(data?.monthlyTrend ?? [])].reverse();

	const options = baseChartOptions({
		plotOptions: { bar: { columnWidth: "45%", borderRadius: 4 } },
		xaxis: {
			categories: trend.map((item) => formatPeriod(item.period)),
			labels: { style: chartAxisLabelStyle },
			axisBorder: { color: "#E2E8F0" },
			axisTicks: { show: false },
		},
		yaxis: { labels: { style: chartAxisLabelStyle, formatter: formatCompactCurrency } },
		grid: { borderColor: "#F1F5F9", strokeDashArray: 4 },
		tooltip: { theme: "light", y: { formatter: formatCurrency } },
	});

	return (
		<ChartCard
			title="Payroll trend"
			description="Net payroll per period (last 6, rejected excluded)"
			isLoading={isLoading}
			isError={isError}
			isEmpty={trend.length === 0}
			emptyText="No payroll generated yet."
			className={className}
		>
			<ApexChart
				type="bar"
				height={280}
				options={options}
				series={[{ name: "Net payroll", data: trend.map((item) => item.total) }]}
			/>
		</ChartCard>
	);
}

export function PayrollStatusChart({ className }: { className?: string }) {
	const { data, isLoading, isError } = usePayrollAnalytics();
	const statuses = data?.byStatus ?? [];

	return (
		<ChartCard
			title="Payroll by status"
			description="Where each payroll record stands"
			isLoading={isLoading}
			isError={isError}
			isEmpty={statuses.length === 0}
			emptyText="No payroll records yet."
			className={className}
		>
			<ApexChart
				type="donut"
				height={280}
				options={statusDonutOptions(
					statuses.map((item) => item.status),
					"Payrolls",
				)}
				series={statuses.map((item) => item._count)}
			/>
		</ChartCard>
	);
}
