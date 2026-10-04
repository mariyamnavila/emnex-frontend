"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { ChartCard } from "@/components/dashboard/chart-card";
import { StatusBadge, UserAvatar } from "@/components/shared";
import { usePayments } from "@/hooks/payment.hook";
import { formatCurrency } from "@/lib/pay";

// Payroll periods are UTC midnight
const formatPeriod = (iso: string) =>
	new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export function RecentPayments({ className }: { className?: string }) {
	const { data, isLoading, isError } = usePayments({ limit: 5 });
	const payments = data?.rows ?? [];

	return (
		<ChartCard
			title="Recent payments"
			description="Latest Stripe payouts and attempts"
			isLoading={isLoading}
			isError={isError}
			isEmpty={payments.length === 0}
			emptyText="No payments yet. Approved payroll can be paid through Stripe."
			className={className}
			action={
				<Link
					href="/finance/payments"
					className="text-xs font-medium text-[#2563EB] hover:underline dark:text-[#60A5FA]"
				>
					View all
				</Link>
			}
		>
			<ul className="divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
				{payments.map((payment) => (
					<li key={payment.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
						<UserAvatar name={payment.employee.user.name} src={payment.employee.user.avatar} size="sm" />
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-[#0F172A] dark:text-white">
								{payment.employee.user.name}
							</p>
							<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
								{formatPeriod(payment.payroll.periodStart)} payroll ·{" "}
								<time dateTime={payment.updatedAt}>
									{formatDistanceToNowStrict(new Date(payment.updatedAt), { addSuffix: true })}
								</time>
							</p>
						</div>
						<div className="flex shrink-0 flex-col items-end gap-1">
							<span className="text-sm font-semibold text-[#0F172A] tabular-nums dark:text-white">
								{formatCurrency(payment.amount)}
							</span>
							<StatusBadge status={payment.status} />
						</div>
					</li>
				))}
			</ul>
		</ChartCard>
	);
}
