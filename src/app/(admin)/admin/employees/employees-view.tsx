"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Eye,
	KeyRound,
	MoreHorizontal,
	Pencil,
	Plus,
	UserCheck,
	UserMinus,
	Users,
	UserCog,
	UserX,
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ConfirmDialog,
	DataTable,
	type DataTableColumn,
	EmptyState,
	FilterSelect,
	FilterTabs,
	PageHeader,
	SearchInput,
	StatCard,
	StatusBadge,
	TablePagination,
	UserAvatar,
} from "@/components/shared";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { errorMessage } from "@/lib/api";
import {
	useEmployeeAnalytics,
	useEmployees,
	useResendCredentials,
	useTerminateEmployee,
} from "@/hooks/employee.hook";
import { useDepartments } from "@/hooks/department.hook";
import { formatCurrency } from "@/lib/pay";
import { formatDay, plural, sumByStatus } from "@/lib/utils";
import type { Employee, EmployeeStatus } from "@/types/employee.type";
import { EmployeeDetailSheet } from "@/components/employees/employee-detail-sheet";
import { EmployeeStatusDialog } from "@/components/employees/employee-status-dialog";
import { EmployeeEditDialog } from "@/components/employees/employee-edit-dialog";
import { CredentialsDialog } from "@/components/employees/credentials-dialog";
import { useCan } from "@/hooks/auth.hook";

const STATUS_TABS: { value: EmployeeStatus | ""; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "ACTIVE", label: "Active" },
	{ value: "INACTIVE", label: "Inactive" },
	{ value: "SUSPENDED", label: "Suspended" },
	{ value: "TERMINATED", label: "Terminated" },
];


// "$4,000.00 /mo" — right-aligned, tabular figures (theme.md §4)
function PayCell({ employee }: { employee: Employee }) {
	const isMonthly = employee.salaryType === "MONTHLY";
	const amount = isMonthly ? employee.salary : employee.hourlyRate;

	if (amount === null) {
		return <span className="text-[#94A3B8]">—</span>;
	}

	return (
		<span className="whitespace-nowrap tabular-nums">
			<span className="font-medium text-[#0F172A] dark:text-white">
				{formatCurrency(amount)}
			</span>
			<span className="ml-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
				{isMonthly ? "/mo" : "/hr"}
			</span>
		</span>
	);
}

export function EmployeesView() {
	const { get, apply, page } = useUrlFilters();
	const [selected, setSelected] = useState<Employee | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [pendingTerminate, setPendingTerminate] = useState<Employee | null>(
		null,
	);
	const [statusTarget, setStatusTarget] = useState<Employee | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<Employee | null>(null);
	const [editOpen, setEditOpen] = useState(false);
	const [pendingResend, setPendingResend] = useState<Employee | null>(null);
	const [resent, setResent] = useState<{ employee: Employee; password: string } | null>(null);

	const can = useCan();

	const search = get("search");
	const status = get("status");
	const departmentId = get("departmentId");

	const { data, isLoading, isError, error } = useEmployees({
		page,
		search,
		status,
		departmentId,
	});
	const { data: analytics, isLoading: analyticsLoading } =
		useEmployeeAnalytics();
	const { data: departments = [] } = useDepartments();
	const terminateEmployee = useTerminateEmployee();
	const resendCredentials = useResendCredentials();

	const rows = data?.rows ?? [];
	const meta = data?.meta;
	const hasFilters = Boolean(search || status || departmentId);

	// Headcount by status for the stat cards
	const countOf = (value: EmployeeStatus) =>
		analytics?.byStatus.find((item) => item.status === value)?._count ?? 0;
	const total = sumByStatus(analytics?.byStatus).count;
	const active = countOf("ACTIVE");
	const onHold = countOf("INACTIVE") + countOf("SUSPENDED");
	const terminated = countOf("TERMINATED");

	function openDetails(employee: Employee) {
		setSelected(employee);
		setSheetOpen(true);
	}

	function openStatus(employee: Employee) {
		setStatusTarget(employee);
		setStatusOpen(true);
	}

	function openEdit(employee: Employee) {
		setEditTarget(employee);
		setEditOpen(true);
	}

	const columns: DataTableColumn<Employee>[] = [
		{
			key: "employee",
			header: "Employee",
			cell: (row) => (
				<div className="flex items-center gap-3 @lg:min-w-48">
					<UserAvatar name={row.user.name} src={row.user.avatar} />
					<div className="min-w-0">
						<p className="truncate font-medium text-[#0F172A] dark:text-white">
							{row.user.name}
						</p>
						<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
							{row.user.email}
						</p>
						{/* Phones: status + pay here instead of their own columns */}
						<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs @lg:hidden">
							<StatusBadge status={row.status} />
							<PayCell employee={row} />
						</div>
					</div>
				</div>
			),
		},
		{
			key: "position",
			header: "Position",
			headerClassName: "hidden @3xl:table-cell",
			className: "hidden @3xl:table-cell",
			cell: (row) => (
				<div className="min-w-0">
					<p className="truncate text-[#0F172A] dark:text-white">
						{row.jobTitle}
					</p>
					<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
						{row.department?.name ?? "No department"}
					</p>
				</div>
			),
		},
		{
			key: "code",
			header: "Code",
			headerClassName: "hidden @4xl:table-cell",
			className: "hidden @4xl:table-cell",
			cell: (row) => (
				<span className="font-mono text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
					{row.employeeCode}
				</span>
			),
		},
		{
			key: "pay",
			header: "Pay",
			headerClassName: "hidden @lg:table-cell text-right",
			className: "hidden @lg:table-cell text-right",
			cell: (row) => <PayCell employee={row} />,
		},
		{
			key: "joined",
			header: "Joined",
			headerClassName: "hidden @5xl:table-cell",
			className: "hidden @5xl:table-cell whitespace-nowrap tabular-nums",
			cell: (row) => formatDay(row.joiningDate),
		},
		{
			key: "status",
			header: "Status",
			headerClassName: "hidden @lg:table-cell",
			className: "hidden @lg:table-cell",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-12",
			className: "w-12 text-right",
			cell: (row) => (
				<div onClick={(event) => event.stopPropagation()}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
								aria-label={`Actions for ${row.user.name}`}
							>
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-44 border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
						>
							<DropdownMenuItem
								className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
								onSelect={() => openDetails(row)}
							>
								<Eye className="size-4" />
								View profile
							</DropdownMenuItem>
							{row.status !== "TERMINATED" && can("employee.update") ? (
								<DropdownMenuItem
									className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
									onSelect={() => openEdit(row)}
								>
									<Pencil className="size-4" />
									Edit details
								</DropdownMenuItem>
							) : null}
							{can("employee.update") ? (
								<DropdownMenuItem
									className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
									onSelect={() => openStatus(row)}
								>
									<UserCog className="size-4" />
									Change status
								</DropdownMenuItem>
							) : null}
							{row.status !== "TERMINATED" && can("employee.create") ? (
								<DropdownMenuItem
									className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
									onSelect={() => setPendingResend(row)}
								>
									<KeyRound className="size-4" />
									Resend credentials
								</DropdownMenuItem>
							) : null}
							{row.status !== "TERMINATED" && can("employee.delete") ? (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="gap-2 text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626] dark:text-[#F87171] dark:focus:bg-[#450A0A]"
										onSelect={() => setPendingTerminate(row)}
									>
										<UserX className="size-4" />
										Terminate
									</DropdownMenuItem>
								</>
							) : null}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Employees"
				description="Your organization's workforce — profiles, positions and pay."
				actions={
					<Button
						asChild
						className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
					>
						<Link href="/admin/employees/new">
							<Plus className="size-4" />
							New employee
						</Link>
					</Button>
				}
			/>

			{/* Headcount summary */}
			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Total employees"
					isLoading={analyticsLoading}
					value={total}
					icon={Users}
					hint={`Across ${plural(departments.length, "department")}`}
				/>
				<StatCard
					title="Active"
					isLoading={analyticsLoading}
					value={active}
					icon={UserCheck}
					hint={
						total > 0
							? `${Math.round((active / total) * 100)}% of workforce`
							: "No employees yet"
					}
				/>
				<StatCard
					title="Inactive & suspended"
					isLoading={analyticsLoading}
					value={onHold}
					icon={UserMinus}
					hint="Can't be assigned new tasks"
				/>
				<StatCard
					title="Terminated"
					isLoading={analyticsLoading}
					value={terminated}
					icon={UserX}
					hint="Access revoked, records kept"
				/>
			</div>

			{/* Directory: toolbar + table + pagination in one card */}
			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 @4xl:flex-row @4xl:items-center @4xl:justify-between dark:border-[#1E293B]">
					{/* Status segmented control (scrolls sideways on small screens) */}
					<FilterTabs
						label="Filter by status"
						tabs={STATUS_TABS}
						value={status}
						onChange={(value) => apply({ status: value || null })}
					/>

					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<SearchInput placeholder="Search name, email, code..." />
						<FilterSelect
							label="Filter by department"
							allLabel="All departments"
							value={departmentId}
							onChange={(value) => apply({ departmentId: value })}
							options={departments.map((department) => ({ value: department.id, label: department.name }))}
							className="sm:w-44"
						/>
						{hasFilters ? (
							<Button
								variant="ghost"
								className="h-9 text-xs font-medium text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
								onClick={() =>
									apply({ search: null, status: null, departmentId: null })
								}
							>
								Clear
							</Button>
						) : null}
					</div>
				</div>

				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(row) => row.id}
					isLoading={isLoading}
					onRowClick={openDetails}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={Users}
							title={isError ? "Couldn't load employees" : "No employees found"}
							description={
								isError
									? errorMessage(error, "Please try again in a moment.")
									: hasFilters
										? "No one matches these filters. Try a different search or status."
										: "Add your first employee to start assigning tasks and running payroll."
							}
							action={
								hasFilters ? (
									<Button
										variant="outline"
										className="h-9 border-[#E2E8F0] text-sm text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
										onClick={() =>
											apply({ search: null, status: null, departmentId: null })
										}
									>
										Clear filters
									</Button>
								) : (
									<Button
										asChild
										className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
									>
										<Link href="/admin/employees/new">
											<Plus className="size-4" />
											New employee
										</Link>
									</Button>
								)
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

			<EmployeeDetailSheet
				employee={selected}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onChangeStatus={can("employee.update") ? openStatus : undefined}
			/>

			<EmployeeStatusDialog
				employee={statusTarget}
				open={statusOpen}
				onOpenChange={setStatusOpen}
			/>

			<EmployeeEditDialog employee={editTarget} open={editOpen} onOpenChange={setEditOpen} />

			<ConfirmDialog
				open={pendingResend !== null}
				onOpenChange={(open) => {
					if (!open) setPendingResend(null);
				}}
				title="Resend credentials?"
				description={
					pendingResend
						? `A new temporary password will be emailed to ${pendingResend.user.name} (${pendingResend.user.email}). Their current password stops working right away, and they'll set a new one at next login.`
						: null
				}
				confirmLabel="Resend"
				pendingLabel="Sending..."
				isPending={resendCredentials.isPending}
				onConfirm={() => {
					if (!pendingResend) return;
					const target = pendingResend;
					resendCredentials.mutate(target.id, {
						onSuccess: ({ data }) => {
							setResent({ employee: target, password: data.temporaryPassword });
							setPendingResend(null);
						},
					});
				}}
			/>

			<CredentialsDialog
				open={resent !== null}
				onOpenChange={(open) => {
					if (!open) setResent(null);
				}}
				title="New credentials"
				description={
					resent
						? `A new temporary password for ${resent.employee.user.name}. It was also emailed — share this if it doesn't arrive. It won't be shown again.`
						: ""
				}
				email={resent?.employee.user.email ?? ""}
				temporaryPassword={resent?.password ?? ""}
			/>

			<Dialog
				open={pendingTerminate !== null}
				onOpenChange={(open) => {
					if (!open) setPendingTerminate(null);
				}}
			>
				<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
					<DialogHeader>
						<DialogTitle className="text-[#0F172A] dark:text-white">
							Terminate employee?
						</DialogTitle>
						<DialogDescription>
							{pendingTerminate
								? `${pendingTerminate.user.name} (${pendingTerminate.employeeCode}) will lose access to EmNex immediately. Their tasks, submissions and payroll history are kept.`
								: null}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
							onClick={() => setPendingTerminate(null)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							disabled={terminateEmployee.isPending}
							onClick={() => {
								if (!pendingTerminate) return;
								terminateEmployee.mutate(pendingTerminate.id, {
									onSettled: () => setPendingTerminate(null),
								});
							}}
						>
							{terminateEmployee.isPending ? "Terminating..." : "Terminate"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
