"use client";

import { useState } from "react";
import { AlertTriangle, CalendarCheck, CheckCircle2, ChevronRight, CreditCard, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DataTable,
	type DataTableColumn,
	EmptyState,
	PageHeader,
	StatCard,
	StatusBadge,
	StatusFilter,
	TablePagination,
} from "@/components/shared";
import { PaymentSheet } from "@/components/payments/payment-sheet";
import { useMyPayments } from "@/hooks/payment.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { errorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/pay";
import { formatDay, formatMonth, paginate, plural, sumBy, timeAgo, whereStatus } from "@/lib/utils";
import type { MyPayment, PaymentStatus } from "@/types/payment.type";

const STATUSES: { value: PaymentStatus; label: string }[] = [
	{ value: "COMPLETED", label: "Completed" },
	{ value: "PROCESSING", label: "Processing" },
	{ value: "PENDING", label: "Pending" },
	{ value: "FAILED", label: "Failed" },
	{ value: "REFUNDED", label: "Refunded" },
];

// Only the employee's own payments — paying happens on the finance side (and never for yourself)
export function MyPaymentsView() {
	const { get, apply, page } = useUrlFilters();
	const status = get("status") as PaymentStatus | "";
	const { data, isLoading, isError, error } = useMyPayments();
	const [selected, setSelected] = useState<MyPayment | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);

	const all = data ?? [];
	const received = whereStatus(all, ["COMPLETED"]);
	const inProgress = whereStatus(all, ["PENDING", "PROCESSING"]);
	const failed = whereStatus(all, ["FAILED"]);
	const lastReceived = [...received].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];

	const filtered = status ? whereStatus(all, [status]) : all;
	const { rows, totalPages } = paginate(filtered, page);

	const columns: DataTableColumn<MyPayment>[] = [
		{
			key: "payroll",
			header: "Payroll",
			cell: (row) => (
				<div className="min-w-0">
					<p className="text-sm font-medium text-[#0F172A] dark:text-white">{formatMonth(row.payroll.periodStart)}</p>
					<p className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
						{formatDay(row.payroll.periodStart)} – {formatDay(row.payroll.periodEnd)}
					</p>
					<div className="mt-1.5 @lg:hidden">
						<StatusBadge status={row.status} />
					</div>
				</div>
			),
		},
		{
			key: "amount",
			header: "Amount",
			headerClassName: "text-right",
			className: "text-right tabular-nums whitespace-nowrap",
			cell: (row) => <span className="font-semibold text-[#0F172A] dark:text-white">{formatCurrency(row.amount)}</span>,
		},
		{
			key: "status",
			header: "Status",
			headerClassName: "hidden @lg:table-cell",
			className: "hidden @lg:table-cell",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "updated",
			header: "Last update",
			headerClassName: "hidden @2xl:table-cell",
			className: "hidden @2xl:table-cell whitespace-nowrap text-sm text-[#334155] dark:text-[#CBD5E1]",
			cell: (row) => <time dateTime={row.updatedAt}>{timeAgo(row.updatedAt)}</time>,
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
			<PageHeader
				title="My Payments"
				description="Money paid to you for approved payroll, and the status of each Stripe payment."
			/>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Received"
					isLoading={isLoading}
					value={formatCurrency(sumBy(received, (payment) => payment.amount))}
					icon={CheckCircle2}
					hint={plural(received.length, "completed payment")}
				/>
				<StatCard
					title="In progress"
					isLoading={isLoading}
					value={formatCurrency(sumBy(inProgress, (payment) => payment.amount))}
					icon={Hourglass}
					hint={inProgress.length > 0 ? `${plural(inProgress.length, "payment")} at Stripe` : "Nothing in progress"}
				/>
				<StatCard
					title="Failed"
					isLoading={isLoading}
					value={failed.length}
					icon={AlertTriangle}
					hint={failed.length > 0 ? "Finance can retry these" : "No failed payments"}
				/>
				<StatCard
					title="Last paid"
					isLoading={isLoading}
					value={lastReceived ? formatDay(lastReceived.updatedAt) : "—"}
					icon={CalendarCheck}
					hint={lastReceived ? `${formatMonth(lastReceived.payroll.periodStart)} payroll` : "No payments yet"}
				/>
			</div>

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="border-b border-[#E2E8F0] p-4 dark:border-[#1E293B]">
					<StatusFilter
						label="Filter by status"
						value={status}
						onChange={(value) => apply({ status: value })}
						tabs={[
							{ value: "", label: "All", count: isLoading ? undefined : all.length },
							...STATUSES.map((item) => ({
								value: item.value,
								label: item.label,
								count: isLoading ? undefined : whereStatus(all, [item.value]).length,
							})),
						]}
					/>
				</div>

				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(row) => row.id}
					isLoading={isLoading}
					onRowClick={(row) => {
						setSelected(row);
						setSheetOpen(true);
					}}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={CreditCard}
							title={isError ? "Your payments couldn't be loaded" : status ? "No payments here" : "No payments yet"}
							description={
								isError
									? errorMessage(error, "Please try again in a moment.")
									: status
										? "Try another status."
										: "Payments appear here once finance pays your approved payroll."
							}
							action={
								status ? (
									<Button variant="outline" onClick={() => apply({ status: null })}>
										Show all
									</Button>
								) : null
							}
						/>
					}
				/>

				<div className="border-t border-[#E2E8F0] px-4 py-1 dark:border-[#1E293B]">
					<TablePagination page={page} totalPages={totalPages} total={filtered.length} isLoading={isLoading} />
				</div>
			</section>

			<PaymentSheet payment={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
		</div>
	);
}
