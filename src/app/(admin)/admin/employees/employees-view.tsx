"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Trash2, Plus } from "lucide-react";
import Link from "next/link";
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
	PageHeader,
	SearchInput,
	StatusBadge,
	TablePagination,
	UserAvatar,
} from "@/components/shared";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useDeleteEmployee, useDepartments, useEmployees } from "@/hooks/employee.hook";
import type { Employee } from "@/types/employee.type";
import { EmployeeDetailSheet } from "@/components/employees/employee-detail-sheet";

const STATUS_OPTIONS = [
	{ value: "ACTIVE", label: "Active" },
	{ value: "INACTIVE", label: "Inactive" },
	{ value: "SUSPENDED", label: "Suspended" },
	{ value: "TERMINATED", label: "Terminated" },
];

const ALL = "__all__";

export function EmployeesView() {
	const { get, apply, page } = useUrlFilters();
	const [selected, setSelected] = useState<Employee | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

	const search = get("search");
	const status = get("status");
	const departmentId = get("departmentId");

	const { data, isLoading } = useEmployees({
		page,
		search,
		status,
		departmentId,
	});
	const { data: departments = [] } = useDepartments();
	const deleteEmployee = useDeleteEmployee();

	const rows = data?.rows ?? [];
	const meta = data?.meta;

	const columns: DataTableColumn<Employee>[] = [
		{
			key: "employee",
			header: "Employee",
			cell: (row) => (
				<div className="flex items-center gap-3">
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
			key: "code",
			header: "Code",
			cell: (row) => (
				<span className="font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">
					{row.employeeCode}
				</span>
			),
		},
		{
			key: "department",
			header: "Department",
			cell: (row) => row.department?.name ?? "—",
		},
		{
			key: "jobTitle",
			header: "Job title",
			cell: (row) => row.jobTitle,
		},
		{
			key: "salary",
			header: "Salary",
			cell: (row) => (
				<span className="tabular-nums">
					{row.salaryType === "MONTHLY"
						? `$${(row.salary ?? 0).toLocaleString()}`
						: `$${(row.hourlyRate ?? 0).toFixed(2)}/hr`}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "actions",
			header: "",
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
							className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
						>
							<DropdownMenuItem
								className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
								onSelect={() => {
									setSelected(row);
									setSheetOpen(true);
								}}
							>
								<Eye className="size-4" />
								View details
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="gap-2 text-[#DC2626] focus:bg-[#FEF2F2] dark:text-[#F87171] dark:focus:bg-[#450A0A]"
								onSelect={() => setPendingDelete(row)}
							>
								<Trash2 className="size-4" />
								Delete employee
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	const hasFilters = Boolean(search || status || departmentId);

	return (
		<div className="space-y-5">
			<PageHeader
				title="Employees"
				description="Manage your organization's workforce"
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

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<SearchInput placeholder="Search name, email, code..." />

				<Select
					value={status || ALL}
					onValueChange={(value) =>
						apply({ status: value === ALL ? null : value })
					}
				>
					<SelectTrigger className="h-9 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] sm:w-40 dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
						<SelectItem value={ALL}>All statuses</SelectItem>
						{STATUS_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={departmentId || ALL}
					onValueChange={(value) =>
						apply({ departmentId: value === ALL ? null : value })
					}
				>
					<SelectTrigger className="h-9 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] sm:w-44 dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white">
						<SelectValue placeholder="Department" />
					</SelectTrigger>
					<SelectContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
						<SelectItem value={ALL}>All departments</SelectItem>
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
						Clear filters
					</Button>
				) : null}
			</div>

			<div>
				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(row) => row.id}
					isLoading={isLoading}
					onRowClick={(row) => {
						setSelected(row);
						setSheetOpen(true);
					}}
					empty={
						<div className="px-6 py-12 text-center">
							<p className="text-sm font-medium text-[#0F172A] dark:text-white">
								No employees found
							</p>
							<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
								{hasFilters
									? "Try adjusting your search or filters."
									: "Create your first employee to get started."}
							</p>
						</div>
					}
				/>
				<TablePagination
					page={page}
					totalPages={meta?.totalPages ?? 1}
					total={meta?.total}
					isLoading={isLoading}
				/>
			</div>

			<EmployeeDetailSheet
				employee={selected}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
			/>

			<Dialog
				open={pendingDelete !== null}
				onOpenChange={(open) => {
					if (!open) setPendingDelete(null);
				}}
			>
				<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
					<DialogHeader>
						<DialogTitle className="text-[#0F172A] dark:text-white">
							Delete employee?
						</DialogTitle>
						<DialogDescription>
							{pendingDelete
								? `${pendingDelete.user.name} (${pendingDelete.employeeCode}) will be permanently removed. This action cannot be undone.`
								: null}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
							onClick={() => setPendingDelete(null)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							disabled={deleteEmployee.isPending}
							onClick={() => {
								if (!pendingDelete) return;
								deleteEmployee.mutate(pendingDelete.id, {
									onSettled: () => setPendingDelete(null),
								});
							}}
						>
							{deleteEmployee.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
