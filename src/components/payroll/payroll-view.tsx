"use client";

import { useState } from "react";
import {
	BadgeCheck,
	CheckCircle2,
	Clock,
	CreditCard,
	MoreHorizontal,
	Plus,
	Wallet,
	XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DataTable,
	type DataTableColumn,
	EmptyState,
	FilterTabs,
	formatStatus,
	PageHeader,
	StatCard,
	StatusBadge,
	TablePagination,
	UserAvatar,
} from "@/components/shared";
import { GeneratePayrollDialog } from "@/components/payroll/generate-payroll-dialog";
import { usePayrollAnalytics } from "@/hooks/analytics.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { useEmployeeOptions } from "@/hooks/employee.hook";
import { useApprovePayroll, usePayrolls, useRejectPayroll } from "@/hooks/payroll.hook";
import { useStartCheckout, warmUpStripe } from "@/hooks/payment.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { formatCurrency } from "@/lib/pay";
import { formatDay } from "@/lib/utils";
import type { Payroll, PayrollStatus } from "@/types/payroll.type";

const STATUS_TABS: { value: PayrollStatus | ""; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "DRAFT", label: "Draft" },
	{ value: "GENERATED", label: "Generated" },
	{ value: "APPROVED", label: "Approved" },
	{ value: "PAID", label: "Paid" },
	{ value: "REJECTED", label: "Rejected" },
];

const REVIEWABLE: PayrollStatus[] = ["DRAFT", "GENERATED"];
const ALL_EMPLOYEES = "__all__";

type PendingAction = { payroll: Payroll; action: "approve" | "reject" | "pay" };

const ACTION_COPY = {
	approve: {
		title: "Approve payroll?",
		description: "Once approved, this payroll can be paid through Stripe.",
		confirm: "Approve",
		busy: "Approving...",
		buttonClass: "bg-[#16A34A] text-white shadow-none hover:bg-[#15803D]",
	},
	reject: {
		title: "Reject payroll?",
		description: "The draft will be marked rejected and can't be paid. Generate a new one if needed.",
		confirm: "Reject",
		busy: "Rejecting...",
		buttonClass: "",
	},
	pay: {
		title: "Pay with Stripe?",
		description:
			"You'll be redirected to Stripe's secure checkout. Test mode: use card 4242 4242 4242 4242, any future date and any CVC.",
		confirm: "Continue to Stripe",
		busy: "Opening Stripe...",
		buttonClass: "bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]",
	},
} as const;

export function PayrollView() {
	const { get, apply, page } = useUrlFilters();
	const status = get("status");
	const employeeId = get("employeeId");
	const hasFilters = Boolean(status || employeeId);

	const { data: me } = useGetMe();
	const can = (permission: string) => me?.permissions.includes(permission) ?? false;
	// Finance managers are employees too; nobody approves or pays their own payroll
	const isOwn = (payroll: Payroll) => payroll.employee.user.id === me?.id;

	const { data, isLoading } = usePayrolls({ page, status, employeeId });
	const { data: analytics, isLoading: analyticsLoading } = usePayrollAnalytics();
	const { data: employees = [] } = useEmployeeOptions();
	const approve = useApprovePayroll();
	const reject = useRejectPayroll();
	const startCheckout = useStartCheckout();

	const [generateOpen, setGenerateOpen] = useState(false);
	const [pending, setPending] = useState<PendingAction | null>(null);

	const rows = data?.rows ?? [];
	const meta = data?.meta;

	const statusTotals = (statuses: PayrollStatus[]) => {
		const items = analytics?.byStatus.filter((item) =>
			statuses.includes(item.status as PayrollStatus),
		);
		return {
			count: items?.reduce((sum, item) => sum + item._count, 0) ?? 0,
			amount: items?.reduce((sum, item) => sum + item.totalAmount, 0) ?? 0,
		};
	};
	const awaiting = statusTotals(REVIEWABLE);
	const approved = statusTotals(["APPROVED"]);
	const paid = statusTotals(["PAID"]);

	const isActing =
		approve.isPending || reject.isPending || startCheckout.isPending || startCheckout.isSuccess;

	function confirmPending() {
		if (!pending) return;
		const { payroll, action } = pending;
		if (action === "pay") {
			// The page navigates away on success, so only close the dialog on failure
			startCheckout.mutate(
				{ payrollId: payroll.id, employeeName: payroll.employee.user.name, netAmount: payroll.netAmount },
				{ onError: () => setPending(null) },
			);
			return;
		}
		const mutation = action === "approve" ? approve : reject;
		mutation.mutate(payroll.id, { onSettled: () => setPending(null) });
	}

	const columns: DataTableColumn<Payroll>[] = [
		{
			key: "employee",
			header: "Employee",
			cell: (row) => (
				<div className="flex items-center gap-3 @lg:min-w-44">
					<UserAvatar name={row.employee.user.name} src={row.employee.user.avatar} />
					<div className="min-w-0">
						<p className="truncate font-medium text-[#0F172A] dark:text-white">
							{row.employee.user.name}
							{isOwn(row) ? <span className="ml-1.5 text-xs font-normal text-[#64748B]">(you)</span> : null}
						</p>
						<p className="truncate font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">
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
			key: "period",
			header: "Period",
			headerClassName: "hidden @2xl:table-cell",
			className: "hidden @2xl:table-cell whitespace-nowrap tabular-nums",
			cell: (row) => `${formatDay(row.periodStart)} – ${formatDay(row.periodEnd)}`,
		},
		{
			key: "gross",
			header: "Gross",
			headerClassName: "hidden @4xl:table-cell text-right",
			className: "hidden @4xl:table-cell text-right tabular-nums",
			cell: (row) => formatCurrency(row.grossAmount),
		},
		{
			key: "deductions",
			header: "Deductions",
			headerClassName: "hidden @4xl:table-cell text-right",
			className: "hidden @4xl:table-cell text-right tabular-nums text-[#64748B] dark:text-[#94A3B8]",
			cell: (row) => (row.deductions > 0 ? `− ${formatCurrency(row.deductions)}` : "—"),
		},
		{
			key: "net",
			header: "Net pay",
			headerClassName: "text-right",
			className: "text-right tabular-nums whitespace-nowrap",
			cell: (row) => (
				<span className="font-semibold text-[#0F172A] dark:text-white">
					{formatCurrency(row.netAmount)}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			headerClassName: "hidden @lg:table-cell",
			className: "hidden @lg:table-cell",
			cell: (row) => (
				<div>
					<StatusBadge status={row.status} />
					{row.payment ? (
						<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
							Payment {formatStatus(row.payment.status).toLowerCase()}
						</p>
					) : null}
				</div>
			),
		},
		{
			key: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-12",
			className: "w-12 text-right",
			cell: (row) => {
				if (isOwn(row)) return null;
				const canApprove = can("payroll.approve") && REVIEWABLE.includes(row.status);
				const canReject = can("payroll.reject") && REVIEWABLE.includes(row.status);
				const canPay =
					can("payment.create") && row.status === "APPROVED" && row.payment?.status !== "COMPLETED";
				if (!canApprove && !canReject && !canPay) return null;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
								aria-label={`Actions for ${row.employee.user.name}'s payroll`}
							>
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-40 border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
						>
							{canPay ? (
								<DropdownMenuItem
									className="gap-2 text-[#2563EB] focus:bg-[#EFF6FF] focus:text-[#2563EB]"
									onSelect={() => {
										warmUpStripe();
										setPending({ payroll: row, action: "pay" });
									}}
								>
									<CreditCard className="size-4" />
									{row.payment ? "Retry payment" : "Pay with Stripe"}
								</DropdownMenuItem>
							) : null}
							{canApprove ? (
								<DropdownMenuItem
									className="gap-2 text-[#16A34A] focus:bg-[#F0FDF4] focus:text-[#16A34A]"
									onSelect={() => setPending({ payroll: row, action: "approve" })}
								>
									<CheckCircle2 className="size-4" />
									Approve
								</DropdownMenuItem>
							) : null}
							{canReject ? (
								<DropdownMenuItem
									className="gap-2 text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626]"
									onSelect={() => setPending({ payroll: row, action: "reject" })}
								>
									<XCircle className="size-4" />
									Reject
								</DropdownMenuItem>
							) : null}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Payroll"
				description="Generate monthly pay, review drafts and approve them for payment."
				actions={
					can("payroll.generate") ? (
						<Button
							onClick={() => setGenerateOpen(true)}
							className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
						>
							<Plus className="size-4" />
							Generate payroll
						</Button>
					) : null
				}
			/>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Total net payroll"
					isLoading={analyticsLoading}
					value={formatCurrency(analytics?.totals.netAmount ?? 0)}
					icon={Wallet}
					hint={`${analytics?.totals.count ?? 0} payroll records`}
				/>
				<StatCard
					title="Awaiting approval"
					isLoading={analyticsLoading}
					value={awaiting.count}
					icon={Clock}
					hint={`${formatCurrency(awaiting.amount)} in drafts`}
				/>
				<StatCard
					title="Approved"
					isLoading={analyticsLoading}
					value={approved.count}
					icon={BadgeCheck}
					hint={`${formatCurrency(approved.amount)} ready to pay`}
				/>
				<StatCard
					title="Paid"
					isLoading={analyticsLoading}
					value={paid.count}
					icon={CheckCircle2}
					hint={`${formatCurrency(paid.amount)} settled`}
				/>
			</div>

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 @2xl:flex-row @2xl:items-center @2xl:justify-between dark:border-[#1E293B]">
					<FilterTabs
						label="Filter by status"
						tabs={STATUS_TABS}
						value={status}
						onChange={(value) => apply({ status: value || null })}
					/>
					<Select
						value={employeeId || ALL_EMPLOYEES}
						onValueChange={(value) =>
							apply({ employeeId: value === ALL_EMPLOYEES ? null : value })
						}
					>
						<SelectTrigger
							aria-label="Filter by employee"
							className="h-9 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] sm:w-56 dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
						>
							<SelectValue placeholder="Employee" />
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
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={Wallet}
							title="No payroll records"
							description={
								hasFilters
									? "Nothing matches these filters."
									: "Generate a payroll draft for an employee to get started."
							}
							action={
								hasFilters ? (
									<Button
										variant="outline"
										className="h-9 border-[#E2E8F0] text-sm text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
										onClick={() => apply({ status: null, employeeId: null })}
									>
										Clear filters
									</Button>
								) : null
							}
						/>
					}
				/>

				<div className="border-t border-[#E2E8F0] px-4 py-1 dark:border-[#1E293B]">
					<TablePagination
						page={page}
						totalPages={meta?.totalPages ?? 1}
						total={meta?.total}
						isLoading={isLoading}
					/>
				</div>
			</section>

			<GeneratePayrollDialog open={generateOpen} onOpenChange={setGenerateOpen} />

			<Dialog
				open={pending !== null}
				onOpenChange={(open) => {
					if (!open) setPending(null);
				}}
			>
				<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
					{pending ? (
						<>
							<DialogHeader>
								<DialogTitle className="text-[#0F172A] dark:text-white">
									{ACTION_COPY[pending.action].title}
								</DialogTitle>
								<DialogDescription>
									{ACTION_COPY[pending.action].description}
								</DialogDescription>
							</DialogHeader>
							<dl className="space-y-1.5 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm dark:border-[#1E293B] dark:bg-[#0B1120]">
								<div className="flex justify-between gap-4">
									<dt className="text-[#64748B]">Employee</dt>
									<dd className="font-medium text-[#0F172A] dark:text-white">
										{pending.payroll.employee.user.name}
									</dd>
								</div>
								<div className="flex justify-between gap-4">
									<dt className="text-[#64748B]">Period</dt>
									<dd className="tabular-nums">
										{formatDay(pending.payroll.periodStart)} – {formatDay(pending.payroll.periodEnd)}
									</dd>
								</div>
								<div className="flex justify-between gap-4">
									<dt className="text-[#64748B]">Net pay</dt>
									<dd className="font-bold text-[#0F172A] tabular-nums dark:text-white">
										{formatCurrency(pending.payroll.netAmount)}
									</dd>
								</div>
							</dl>
							<DialogFooter>
								<Button
									variant="outline"
									disabled={isActing}
									className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
									onClick={() => setPending(null)}
								>
									Cancel
								</Button>
								<Button
									variant={pending.action === "reject" ? "destructive" : "default"}
									disabled={isActing}
									onClick={confirmPending}
									className={ACTION_COPY[pending.action].buttonClass || undefined}
								>
									{isActing ? ACTION_COPY[pending.action].busy : ACTION_COPY[pending.action].confirm}
								</Button>
							</DialogFooter>
						</>
					) : null}
				</DialogContent>
			</Dialog>
		</div>
	);
}
