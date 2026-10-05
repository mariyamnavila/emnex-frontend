"use client";

import { useState } from "react";
import { BadgeCheck, CheckCircle2, ChevronRight, FileText, Hourglass, Wallet } from "lucide-react";
import {
	ApexChart,
	DataTable,
	type DataTableColumn,
	EmptyState,
	PageHeader,
	StatCard,
	StatusBadge,
} from "@/components/shared";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PayslipSheet } from "@/components/payroll/payslip-sheet";
import { useMyPayrolls } from "@/hooks/payroll.hook";
import { errorMessage } from "@/lib/api";
import { monthlyBarOptions } from "@/lib/chart-theme";
import { formatCompactCurrency, formatCurrency } from "@/lib/pay";
import { formatDay, formatMonth, plural, sumBy, whereStatus } from "@/lib/utils";
import type { MyPayroll } from "@/types/payroll.type";

const netOf = (payrolls: MyPayroll[]) => sumBy(payrolls, (payroll) => payroll.netAmount);

export function MyPayrollView() {
	const { data, isLoading, isError, error } = useMyPayrolls();
	const [selected, setSelected] = useState<MyPayroll | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);

	// Newest period first
	const payrolls = [...(data ?? [])].sort((a, b) => b.periodStart.localeCompare(a.periodStart));
	const paid = whereStatus(payrolls, ["PAID"]);
	const approved = whereStatus(payrolls, ["APPROVED"]);
	const preparing = whereStatus(payrolls, ["DRAFT", "GENERATED"]);
	const latest = payrolls.find((payroll) => payroll.status !== "REJECTED");

	// Net pay per month, last 12 periods, rejected payroll left out
	const counted = [...payrolls].reverse().filter((payroll) => payroll.status !== "REJECTED").slice(-12);
	const chartOptions = monthlyBarOptions(
		counted.map((payroll) => formatMonth(payroll.periodStart)),
		{ format: formatCurrency, axisFormat: formatCompactCurrency },
	);

	const columns: DataTableColumn<MyPayroll>[] = [
		{
			key: "period",
			header: "Period",
			cell: (row) => (
				<div className="min-w-0">
					<p className="text-sm font-medium text-[#0F172A] dark:text-white">{formatMonth(row.periodStart)}</p>
					<p className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
						{formatDay(row.periodStart)} – {formatDay(row.periodEnd)}
					</p>
					<div className="mt-1.5 @lg:hidden">
						<StatusBadge status={row.status} />
					</div>
				</div>
			),
		},
		{
			key: "gross",
			header: "Gross",
			headerClassName: "hidden @2xl:table-cell text-right",
			className: "hidden @2xl:table-cell text-right tabular-nums",
			cell: (row) => formatCurrency(row.grossAmount),
		},
		{
			key: "deductions",
			header: "Deductions",
			headerClassName: "hidden @3xl:table-cell text-right",
			className: "hidden @3xl:table-cell text-right tabular-nums text-[#64748B] dark:text-[#94A3B8]",
			cell: (row) => (row.deductions > 0 ? `− ${formatCurrency(row.deductions)}` : "—"),
		},
		{
			key: "net",
			header: "Net pay",
			headerClassName: "text-right",
			className: "text-right tabular-nums whitespace-nowrap",
			cell: (row) => <span className="font-semibold text-[#0F172A] dark:text-white">{formatCurrency(row.netAmount)}</span>,
		},
		{
			key: "status",
			header: "Status",
			headerClassName: "hidden @lg:table-cell",
			className: "hidden @lg:table-cell",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "open",
			header: <span className="sr-only">Details</span>,
			headerClassName: "w-8 pl-0",
			className: "w-8 pl-0",
			cell: () => (
				<ChevronRight
					aria-hidden="true"
					className="size-4 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
				/>
			),
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader title="My Payroll" description="Your payslips — what you earned each period and whether it's been paid." />

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Paid to you"
					isLoading={isLoading}
					value={formatCurrency(netOf(paid))}
					icon={CheckCircle2}
					hint={`${plural(paid.length, "payslip")} paid`}
				/>
				<StatCard
					title="Awaiting payment"
					isLoading={isLoading}
					value={formatCurrency(netOf(approved))}
					icon={BadgeCheck}
					hint={approved.length > 0 ? `${approved.length} approved, not paid yet` : "Nothing waiting"}
				/>
				<StatCard
					title="Being prepared"
					isLoading={isLoading}
					value={preparing.length}
					icon={Hourglass}
					hint="Waiting for finance approval"
				/>
				<StatCard
					title="Latest net pay"
					isLoading={isLoading}
					value={latest ? formatCurrency(latest.netAmount) : "—"}
					icon={Wallet}
					hint={latest ? `${formatMonth(latest.periodStart)} · ${latest.status.toLowerCase()}` : "No payslips yet"}
				/>
			</div>

			<ChartCard
				title="Net pay by month"
				description="Your last 12 pay periods (rejected payroll left out)"
				isLoading={isLoading}
				isError={isError}
				isEmpty={counted.length === 0}
				emptyText="Your pay will chart here once payroll is generated."
			>
				<ApexChart
					type="bar"
					height={260}
					options={chartOptions}
					series={[{ name: "Net pay", data: counted.map((payroll) => payroll.netAmount) }]}
				/>
			</ChartCard>

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<header className="border-b border-[#E2E8F0] px-4 py-3 dark:border-[#1E293B]">
					<h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">Payslips</h2>
				</header>
				<DataTable
					columns={columns}
					rows={payrolls}
					rowKey={(row) => row.id}
					isLoading={isLoading}
					onRowClick={(row) => {
						setSelected(row);
						setSheetOpen(true);
					}}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={FileText}
							title={isError ? "Your payslips couldn't be loaded" : "No payslips yet"}
							description={
								isError
									? errorMessage(error, "Please try again in a moment.")
									: "Payroll appears here once finance generates it for you."
							}
						/>
					}
				/>
			</section>

			<PayslipSheet payroll={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
		</div>
	);
}
