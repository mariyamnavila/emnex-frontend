"use client";

import { BadgeCheck, CheckCircle2, Clock, Wallet } from "lucide-react";
import { ApexChart, PageHeader, StatCard } from "@/components/shared";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PayrollStatusChart, PayrollTrendChart } from "@/components/dashboard/payroll-charts";
import { RecentPayments } from "@/components/payments/recent-payments";
import { usePaymentAnalytics, usePayrollAnalytics } from "@/hooks/analytics.hook";
import { statusDonutOptions } from "@/lib/chart-theme";
import { formatCurrency } from "@/lib/pay";

export function FinanceOverview() {
	const payroll = usePayrollAnalytics();
	const payments = usePaymentAnalytics();

	const sumStatuses = (statuses: string[]) => {
		const items = payroll.data?.byStatus.filter((item) => statuses.includes(item.status)) ?? [];
		return {
			count: items.reduce((sum, item) => sum + item._count, 0),
			amount: items.reduce((sum, item) => sum + item.totalAmount, 0),
		};
	};
	const awaiting = sumStatuses(["DRAFT", "GENERATED"]);
	const approved = sumStatuses(["APPROVED"]);
	const paymentStatuses = payments.data?.byStatus ?? [];
	const failed = paymentStatuses.find((item) => item.status === "FAILED")?._count ?? 0;

	return (
		<div className="space-y-6">
			<PageHeader title="Overview" description="Payroll waiting on you, money paid out, and how payments are going." />

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Awaiting approval"
					isLoading={payroll.isLoading}
					value={awaiting.count}
					icon={Clock}
					hint={`${formatCurrency(awaiting.amount)} in drafts`}
				/>
				<StatCard
					title="Ready to pay"
					isLoading={payroll.isLoading}
					value={approved.count}
					icon={BadgeCheck}
					hint={`${formatCurrency(approved.amount)} approved`}
				/>
				<StatCard
					title="Paid out"
					isLoading={payments.isLoading}
					value={formatCurrency(payments.data?.completed.totalAmount ?? 0)}
					icon={CheckCircle2}
					hint={`${payments.data?.completed.count ?? 0} completed payments`}
				/>
				<StatCard
					title="Total payroll"
					isLoading={payroll.isLoading}
					value={formatCurrency(payroll.data?.totals.netAmount ?? 0)}
					icon={Wallet}
					hint={`${payroll.data?.totals.count ?? 0} records, rejected excluded`}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<PayrollTrendChart className="lg:col-span-2" />
				<PayrollStatusChart />
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<ChartCard
					title="Payments by status"
					description={failed > 0 ? `${failed} failed — retry them from Payroll` : "Stripe payments by outcome"}
					isLoading={payments.isLoading}
					isError={payments.isError}
					isEmpty={paymentStatuses.length === 0}
					emptyText="No payments yet."
				>
					<ApexChart
						type="donut"
						height={280}
						options={statusDonutOptions(
							paymentStatuses.map((item) => item.status),
							"Payments",
						)}
						series={paymentStatuses.map((item) => item._count)}
					/>
				</ChartCard>
				<RecentPayments className="lg:col-span-2" />
			</div>
		</div>
	);
}
