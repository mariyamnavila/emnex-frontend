"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Eye,
	MoreHorizontal,
	Plus,
	UserCheck,
	UserMinus,
	Users,
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
	PageHeader,
	SearchInput,
	StatCard,
	StatusBadge,
	TablePagination,
	UserAvatar,
} from "@/components/shared";
import { useUrlFilters } from "@/hooks/use-url-filters";
import {
	useEmployeeAnalytics,
	useEmployees,
	useTerminateEmployee,
} from "@/hooks/employee.hook";
import { useDepartments } from "@/hooks/department.hook";
import { formatCurrency } from "@/lib/pay";
import { cn, formatDate } from "@/lib/utils";
import type { Employee, EmployeeStatus } from "@/types/employee.type";
import { EmployeeDetailSheet } from "@/components/employees/employee-detail-sheet";

const STATUS_TABS: { value: EmployeeStatus | ""; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "ACTIVE", label: "Active" },
	{ value: "INACTIVE", label: "Inactive" },
	{ value: "SUSPENDED", label: "Suspended" },
	{ value: "TERMINATED", label: "Terminated" },
];

const ALL_DEPARTMENTS = "__all__";

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

	const search = get("search");
	const status = get("status");
	const departmentId = get("departmentId");

	const { data, isLoading } = useEmployees({
		page,
		search,
		status,
		departmentId,
	});
	const { data: analytics, isLoading: analyticsLoading } =
		useEmployeeAnalytics();
	const { data: departments = [] } = useDepartments();
	const terminateEmployee = useTerminateEmployee();

	const rows = data?.rows ?? [];
	const meta = data?.meta;
	const hasFilters = Boolean(search || status || departmentId);

	// Headcount by status for the stat cards
	const countOf = (value: EmployeeStatus) =>
		analytics?.byStatus.find((item) => item.status === value)?._count ?? 0;
	const total =
		analytics?.byStatus.reduce((sum, item) => sum + item._count, 0) ?? 0;
	const active = countOf("ACTIVE");
	const onHold = countOf("INACTIVE") + countOf("SUSPENDED");
	const terminated = countOf("TERMINATED");
	const statValue = (value: number) => (analyticsLoading ? "—" : value);

	function openDetails(employee: Employee) {
		setSelected(employee);
		setSheetOpen(true);
	}

	const columns: DataTableColumn<Employee>[] = [
		{
			key: "employee",
			header: "Employee",
			cell: (row) => (
				<div className="flex min-w-48 items-center gap-3">
					<UserAvatar name={row.user.name} src={row.user.avatar} />
					<div className="min-w-0">
						<p className="truncate font-medium text-[#0F172A] dark:text-white">
							{row.user.name}
						</p>
						<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
							{row.user.email}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "position",
			header: "Position",
			headerClassName: "hidden md:table-cell",
			className: "hidden md:table-cell",
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
			headerClassName: "hidden lg:table-cell",
			className: "hidden lg:table-cell",
			cell: (row) => (
				<span className="font-mono text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
					{row.employeeCode}
				</span>
			),
		},
		{
			key: "pay",
			header: "Pay",
			headerClassName: "text-right",
			className: "text-right",
			cell: (row) => <PayCell employee={row} />,
		},
		{
			key: "joined",
			header: "Joined",
			headerClassName: "hidden xl:table-cell",
			className: "hidden xl:table-cell whitespace-nowrap tabular-nums",
			cell: (row) => formatDate(row.joiningDate),
		},
		{
			key: "status",
			header: "Status",
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
							{row.status !== "TERMINATED" ? (
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
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Total employees"
					value={statValue(total)}
					icon={Users}
					hint={`Across ${departments.length} department${departments.length === 1 ? "" : "s"}`}
				/>
				<StatCard
					title="Active"
					value={statValue(active)}
					icon={UserCheck}
					hint={
						total > 0
							? `${Math.round((active / total) * 100)}% of workforce`
							: "No employees yet"
					}
				/>
				<StatCard
					title="Inactive & suspended"
					value={statValue(onHold)}
					icon={UserMinus}
					hint="Can't be assigned new tasks"
				/>
				<StatCard
					title="Terminated"
					value={statValue(terminated)}
					icon={UserX}
					hint="Access revoked, records kept"
				/>
			</div>

			{/* Directory: toolbar + table + pagination in one card */}
			<section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 lg:flex-row lg:items-center lg:justify-between dark:border-[#1E293B]">
					{/* Status segmented control (scrolls sideways on small screens) */}
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

					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<SearchInput placeholder="Search name, email, code..." />
						<Select
							value={departmentId || ALL_DEPARTMENTS}
							onValueChange={(value) =>
								apply({
									departmentId: value === ALL_DEPARTMENTS ? null : value,
								})
							}
						>
							<SelectTrigger
								aria-label="Filter by department"
								className="h-9 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] sm:w-44 dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
							>
								<SelectValue placeholder="Department" />
							</SelectTrigger>
							<SelectContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
								<SelectItem value={ALL_DEPARTMENTS}>All departments</SelectItem>
								{departments.map((department) => (
									<SelectItem key={department.id} value={department.id}>
										{department.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
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
							title="No employees found"
							description={
								hasFilters
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
