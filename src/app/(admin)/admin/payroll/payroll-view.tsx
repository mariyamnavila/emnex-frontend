"use client";

import { useState } from "react";
import {
	BadgeCheck,
	CheckCircle2,
	Clock,
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
import { useUrlFilters } from "@/hooks/use-url-filters";
import { formatCurrency } from "@/lib/pay";
import { cn, formatDay } from "@/lib/utils";
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

type PendingAction = { payroll: Payroll; action: "approve" | "reject" };

export function PayrollView() {
	const { get, apply, page } = useUrlFilters();
	const status = get("status");
	const employeeId = get("employeeId");
	const hasFilters = Boolean(status || employeeId);

	const { data: me } = useGetMe();
	const can = (permission: string) => me?.permissions.includes(permission) ?? false;

	const { data, isLoading } = usePayrolls({ page, status, employeeId });
	const { data: analytics, isLoading: analyticsLoading } = usePayrollAnalytics();
	const { data: employees = [] } = useEmployeeOptions();
	const approve = useApprovePayroll();
	const reject = useRejectPayroll();

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

	const isActing = approve.isPending || reject.isPending;

	function confirmPending() {
		if (!pending) return;
		const mutation = pending.action === "approve" ? approve : reject;
		mutation.mutate(pending.payroll.id, { onSettled: () => setPending(null) });
	}

	const columns: DataTableColumn<Payroll>[] = [
		{
			key: "employee",
			header: "Employee",
			cell: (row) => (
				<div className="flex min-w-44 items-center gap-3">
					<UserAvatar name={row.employee.user.name} src={row.employee.user.avatar} />
					<div className="min-w-0">
						<p className="truncate font-medium text-[#0F172A] dark:text-white">
							{row.employee.user.name}
						</p>
						<p className="truncate font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">
							{row.employee.employeeCode}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "period",
			header: "Period",
			headerClassName: "hidden md:table-cell",
			className: "hidden md:table-cell whitespace-nowrap tabular-nums",
			cell: (row) => `${formatDay(row.periodStart)} – ${formatDay(row.periodEnd)}`,
		},
		{
			key: "gross",
			header: "Gross",
			headerClassName: "hidden lg:table-cell text-right",
			className: "hidden lg:table-cell text-right tabular-nums",
			cell: (row) => formatCurrency(row.grossAmount),
		},
		{
			key: "deductions",
			header: "Deductions",
			headerClassName: "hidden lg:table-cell text-right",
			className: "hidden lg:table-cell text-right tabular-nums text-[#64748B] dark:text-[#94A3B8]",
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
				const canApprove = can("payroll.approve") && REVIEWABLE.includes(row.status);
				const canReject = can("payroll.reject") && REVIEWABLE.includes(row.status);
				if (!canApprove && !canReject) return null;
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

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

			<section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 lg:flex-row lg:items-center lg:justify-between dark:border-[#1E293B]">
					<div className="-mx-1 overflow-x-auto px-1">
						<div
							role="group"
							aria-label="Filter by status"
							className="inline-flex rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-0.5 dark:border-[#1E293B] dark:bg-[#0B1120]"
						>
							{STATUS_TABS.map((tab) => {
								const isActive = status === tab.value;
								return (
									<button
										key={tab.label}
										type="button"
										aria-pressed={isActive}
										onClick={() => apply({ status: tab.value || null })}
										className={cn(
											"h-8 rounded px-3 text-xs font-medium whitespace-nowrap transition-colors",
											isActive
												? "bg-white text-[#0F172A] shadow-2xs dark:bg-[#1E293B] dark:text-white"
												: "text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white",
										)}
									>
										{tab.label}
									</button>
								);
							})}
						</div>
					</div>
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
									{pending.action === "approve" ? "Approve payroll?" : "Reject payroll?"}
								</DialogTitle>
								<DialogDescription>
									{pending.action === "approve"
										? "Once approved, this payroll can be paid through Stripe."
										: "The draft will be marked rejected and can't be paid. Generate a new one if needed."}
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
									variant={pending.action === "approve" ? "default" : "destructive"}
									disabled={isActing}
									onClick={confirmPending}
									className={
										pending.action === "approve"
											? "bg-[#16A34A] text-white shadow-none hover:bg-[#15803D]"
											: undefined
									}
								>
									{isActing
										? "Saving..."
										: pending.action === "approve"
											? "Approve"
											: "Reject"}
								</Button>
							</DialogFooter>
						</>
					) : null}
				</DialogContent>
			</Dialog>
		</div>
	);
}
