"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { AlertTriangle, BadgeCheck, CheckCircle2, ChevronRight, CreditCard, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	DataTable,
	type DataTableColumn,
	EmptyState,
	FilterTabs,
	PageHeader,
	StatCard,
	StatusBadge,
	TablePagination,
	UserAvatar,
} from "@/components/shared";
import { PaymentSheet } from "@/components/payments/payment-sheet";
import { usePaymentAnalytics, usePayrollAnalytics } from "@/hooks/analytics.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { useEmployeeOptions } from "@/hooks/employee.hook";
import { usePayments, useStartCheckout, warmUpStripe } from "@/hooks/payment.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { formatCurrency } from "@/lib/pay";
import type { Payment, PaymentStatus } from "@/types/payment.type";

const STATUS_TABS: { value: PaymentStatus | ""; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "COMPLETED", label: "Completed" },
	{ value: "PROCESSING", label: "Processing" },
	{ value: "PENDING", label: "Pending" },
	{ value: "FAILED", label: "Failed" },
	{ value: "REFUNDED", label: "Refunded" },
];
const ALL_EMPLOYEES = "__all__";

// Payroll periods are UTC midnight
const formatPeriod = (iso: string) =>
	new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const timeAgo = (iso: string) => formatDistanceToNowStrict(new Date(iso), { addSuffix: true });

export function PaymentsView() {
	const { get, apply, page } = useUrlFilters();
	const status = get("status") as PaymentStatus | "";
	const employeeId = get("employeeId");
	const hasFilters = Boolean(status || employeeId);

	const { data, isLoading } = usePayments({ page, status: status || undefined, employeeId: employeeId || undefined });
	const analytics = usePaymentAnalytics();
	const payroll = usePayrollAnalytics();
	const { data: employees = [] } = useEmployeeOptions();
	const { data: me } = useGetMe();
	const startCheckout = useStartCheckout();

	const [selected, setSelected] = useState<Payment | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);

	const rows = data?.rows ?? [];
	const meta = data?.meta;

	const byStatus = (statuses: PaymentStatus[]) => {
		const items = analytics.data?.byStatus.filter((item) => statuses.includes(item.status as PaymentStatus)) ?? [];
		return {
			count: items.reduce((sum, item) => sum + item._count, 0),
			amount: items.reduce((sum, item) => sum + item.totalAmount, 0),
		};
	};
	const inProgress = byStatus(["PENDING", "PROCESSING"]);
	const failed = byStatus(["FAILED"]);
	const approved = payroll.data?.byStatus.find((item) => item.status === "APPROVED");

	// Same rule as the backend: anything not completed can be retried while its payroll is approved
	const canRetry = (payment: Payment) =>
		(me?.permissions.includes("payment.create") ?? false) &&
		payment.status !== "COMPLETED" &&
		payment.status !== "REFUNDED" &&
		payment.payroll.status === "APPROVED" &&
		payment.employee.user.id !== me?.id;

	function openPayment(payment: Payment) {
		setSelected(payment);
		setSheetOpen(true);
		if (canRetry(payment)) warmUpStripe();
	}

	function retry(payment: Payment) {
		startCheckout.mutate({
			payrollId: payment.payrollId,
			employeeName: payment.employee.user.name,
			netAmount: payment.payroll.netAmount,
		});
	}

	const columns: DataTableColumn<Payment>[] = [
		{
			key: "employee",
			header: "Employee",
			cell: (row) => (
				<div className="flex items-center gap-3 @lg:min-w-44">
					<UserAvatar name={row.employee.user.name} src={row.employee.user.avatar} />
					<div className="min-w-0">
						<p className="truncate font-medium text-[#0F172A] dark:text-white">{row.employee.user.name}</p>
						<p className="truncate text-xs text-[#64748B] @2xl:hidden dark:text-[#94A3B8]">
							{formatPeriod(row.payroll.periodStart)} payroll
						</p>
						<p className="hidden truncate font-mono text-xs text-[#64748B] @2xl:block dark:text-[#94A3B8]">
							{row.employee.employeeCode}
						</p>
						<div className="mt-1.5 @lg:hidden">
							<StatusBadge status={row.status} />
						</div>
					</div>
				</div>
			),
		},
		{
			key: "payroll",
			header: "Payroll",
			headerClassName: "hidden @2xl:table-cell",
			className: "hidden @2xl:table-cell whitespace-nowrap",
			cell: (row) => (
				<div>
					<p className="text-sm text-[#0F172A] dark:text-white">{formatPeriod(row.payroll.periodStart)}</p>
					<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
						Payroll {row.payroll.status.toLowerCase()}
					</p>
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
			headerClassName: "hidden @4xl:table-cell",
			className: "hidden @4xl:table-cell whitespace-nowrap",
			cell: (row) => (
				<time dateTime={row.updatedAt} className="text-sm text-[#334155] dark:text-[#CBD5E1]">
					{timeAgo(row.updatedAt)}
				</time>
			),
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
				title="Payments"
				description="Every Stripe payment for approved payroll — what's paid, in progress or needs a retry."
			/>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Paid out"
					isLoading={analytics.isLoading}
					value={formatCurrency(analytics.data?.completed.totalAmount ?? 0)}
					icon={CheckCircle2}
					hint={`${analytics.data?.completed.count ?? 0} completed payments`}
				/>
				<StatCard
					title="In progress"
					isLoading={analytics.isLoading}
					value={inProgress.count}
					icon={Hourglass}
					hint={`${formatCurrency(inProgress.amount)} at Stripe`}
				/>
				<StatCard
					title="Failed"
					isLoading={analytics.isLoading}
					value={failed.count}
					icon={AlertTriangle}
					hint={failed.count > 0 ? "Open one to retry" : "Nothing to retry"}
				/>
				<StatCard
					title="Ready to pay"
					isLoading={payroll.isLoading}
					value={approved?._count ?? 0}
					icon={BadgeCheck}
					hint={`${formatCurrency(approved?.totalAmount ?? 0)} approved payroll`}
				/>
			</div>

			{(approved?._count ?? 0) > 0 ? (
				<div className="flex flex-col gap-3 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-[#1E3A5F] dark:bg-[#0B1120]">
					<p className="text-sm text-[#1E3A8A] dark:text-[#BFDBFE]">
						{approved?._count} approved payroll{approved?._count === 1 ? " is" : "s are"} waiting to be paid.
					</p>
					<Button asChild size="sm" className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]">
						<Link href="/finance/payroll?status=APPROVED">
							<CreditCard className="size-4" />
							Pay from Payroll
						</Link>
					</Button>
				</div>
			) : null}

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 @2xl:flex-row @2xl:items-center @2xl:justify-between dark:border-[#1E293B]">
					<FilterTabs
						label="Filter by status"
						tabs={STATUS_TABS.map((tab) => ({
							...tab,
							count: analytics.isLoading
								? undefined
								: tab.value
									? byStatus([tab.value]).count
									: (analytics.data?.byStatus.reduce((sum, item) => sum + item._count, 0) ?? 0),
						}))}
						value={status}
						onChange={(value) => apply({ status: value || null })}
					/>
					<Select
						value={employeeId || ALL_EMPLOYEES}
						onValueChange={(value) => apply({ employeeId: value === ALL_EMPLOYEES ? null : value })}
					>
						<SelectTrigger
							aria-label="Filter by employee"
							className="h-9 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] @2xl:w-56 dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
						>
							<SelectValue placeholder="All employees" />
						</SelectTrigger>
						<SelectContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
							<SelectItem value={ALL_EMPLOYEES}>All employees</SelectItem>
							{employees.map((employee) => (
								<SelectItem key={employee.id} value={employee.id}>
									{employee.user.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(row) => row.id}
					isLoading={isLoading}
					onRowClick={openPayment}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={CreditCard}
							title={hasFilters ? "No payments match" : "No payments yet"}
							description={
								hasFilters
									? "Try another status or employee."
									: "Payments appear here once approved payroll is paid through Stripe."
							}
							action={
								hasFilters ? (
									<Button variant="outline" onClick={() => apply({ status: null, employeeId: null })}>
										Clear filters
									</Button>
								) : null
							}
						/>
					}
				/>

				<div className="border-t border-[#E2E8F0] px-4 py-1 dark:border-[#1E293B]">
					<TablePagination page={page} totalPages={meta?.totalPages ?? 1} total={meta?.total} isLoading={isLoading} />
				</div>
			</section>

			<PaymentSheet
				payment={selected}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				canRetry={selected ? canRetry(selected) : false}
				isRetrying={startCheckout.isPending || startCheckout.isSuccess}
				onRetry={retry}
			/>
		</div>
	);
}
