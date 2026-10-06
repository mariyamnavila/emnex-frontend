"use client";

import { useState } from "react";
import { Check, ChevronRight, ClipboardCheck, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DataTable,
	type DataTableColumn,
	EmployeeFilter,
	EmptyState,
	FilterTabs,
	PageHeader,
	StatusBadge,
	TablePagination,
	UserAvatar,
} from "@/components/shared";
import { RejectSubmissionDialog } from "@/components/submissions/reject-submission-dialog";
import { SubmissionSheet } from "@/components/submissions/submission-sheet";
import { useCan, useCurrentUser } from "@/hooks/auth.hook";
import { errorMessage } from "@/lib/api";
import { useEmployeeOptions } from "@/hooks/employee.hook";
import { useApproveSubmission, useSubmissions } from "@/hooks/submission.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { formatDay, timeAgo } from "@/lib/utils";
import type { Submission, SubmissionStatus } from "@/types/submission.type";

// No ?status= means the review queue; "ALL" shows every status
const STATUS_TABS: { value: SubmissionStatus | "ALL"; label: string }[] = [
	{ value: "PENDING", label: "Pending" },
	{ value: "APPROVED", label: "Approved" },
	{ value: "REJECTED", label: "Rejected" },
	{ value: "ALL", label: "All" },
];

export function SubmissionsView() {
	const { get, apply, page } = useUrlFilters();
	const status = get("status", "PENDING") as SubmissionStatus | "ALL";
	const employeeId = get("employeeId");
	const isQueue = status === "PENDING";

	const { data, isLoading, isError, error } = useSubmissions({
		page,
		status: status === "ALL" ? undefined : status,
		employeeId: employeeId || undefined,
		oldestFirst: isQueue,
	});
	const { data: employees = [] } = useEmployeeOptions();
	const currentUser = useCurrentUser();
	const can = useCan();
	const canApprove = can("submission.approve");
	const canReject = can("submission.reject");
	const approve = useApproveSubmission();

	const [selected, setSelected] = useState<Submission | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [rejecting, setRejecting] = useState<Submission | null>(null);
	const [rejectOpen, setRejectOpen] = useState(false);

	const rows = data?.rows ?? [];
	const meta = data?.meta;
	const isOwn = (submission: Submission) => submission.employee.user.id === currentUser.id;

	const reviewerName = (userId: string | null) => {
		if (!userId) return null;
		if (userId === currentUser.id) return "you";
		return employees.find((employee) => employee.user.id === userId)?.user.name ?? "an admin";
	};

	function openDetails(submission: Submission) {
		setSelected(submission);
		setSheetOpen(true);
	}

	function startReject(submission: Submission) {
		setRejecting(submission);
		setRejectOpen(true);
	}

	// The sheet shows a snapshot, so close it once the review is saved
	function approveSubmission(submission: Submission) {
		approve.mutate(submission, { onSuccess: () => setSheetOpen(false) });
	}

	const columns: DataTableColumn<Submission>[] = [
		{
			key: "employee",
			header: "Employee",
			// Narrow cards fold the task + date in here, so let it wrap instead of widening the table
			className: "whitespace-normal @2xl:whitespace-nowrap",
			cell: (row) => (
				<div className="flex items-center gap-3 @lg:min-w-44">
					<UserAvatar name={row.employee.user.name} src={row.employee.user.avatar} />
					<div className="min-w-0">
						<p className="font-medium text-[#0F172A] @2xl:truncate dark:text-white">
							{row.employee.user.name}
							{isOwn(row) ? <span className="ml-1.5 text-xs font-normal text-[#64748B]">(you)</span> : null}
						</p>
						<p className="line-clamp-2 text-xs text-[#64748B] @2xl:hidden dark:text-[#94A3B8]">
							{row.task.title} · {formatDay(new Date(row.workDate))}
						</p>
						<p className="hidden truncate font-mono text-xs text-[#64748B] @2xl:block dark:text-[#94A3B8]">
							{row.employee.employeeCode}
						</p>
						{status === "ALL" ? (
							<div className="mt-1.5 @4xl:hidden">
								<StatusBadge status={row.status} />
							</div>
						) : null}
					</div>
				</div>
			),
		},
		{
			key: "task",
			header: "Task",
			headerClassName: "hidden @2xl:table-cell",
			className: "hidden @2xl:table-cell",
			cell: (row) => (
				<div className="max-w-48 min-w-0 @4xl:max-w-64">
					<p className="truncate text-sm text-[#0F172A] dark:text-white">{row.task.title}</p>
					{row.task.project ? (
						<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{row.task.project.name}</p>
					) : null}
				</div>
			),
		},
		{
			key: "worked",
			header: "Worked",
			headerClassName: "hidden @2xl:table-cell",
			className: "hidden @2xl:table-cell whitespace-nowrap tabular-nums",
			cell: (row) => (
				<div>
					<p className="text-sm text-[#0F172A] dark:text-white">{formatDay(new Date(row.workDate))}</p>
					<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">submitted {timeAgo(row.createdAt)}</p>
				</div>
			),
		},
		{
			key: "hours",
			header: "Hours",
			headerClassName: "text-right",
			className: "text-right tabular-nums whitespace-nowrap",
			cell: (row) => <span className="font-semibold text-[#0F172A] dark:text-white">{row.hoursWorked} h</span>,
		},
		{
			key: "status",
			header: "Status",
			headerClassName: "hidden @4xl:table-cell",
			className: "hidden @4xl:table-cell",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-24 pl-0",
			className: "w-24 pl-0 text-right",
			cell: (row) => {
				if (row.status !== "PENDING" || isOwn(row) || (!canApprove && !canReject)) {
					return (
						<ChevronRight
							aria-hidden="true"
							className="ml-auto size-4 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
						/>
					);
				}
				const isApproving = approve.isPending && approve.variables?.id === row.id;
				return (
					<div className="flex justify-end gap-1.5" onClick={(event) => event.stopPropagation()}>
						{canReject ? (
							<Button
								size="icon"
								variant="outline"
								disabled={isApproving}
								onClick={() => startReject(row)}
								aria-label={`Reject ${row.employee.user.name}'s ${row.hoursWorked} h`}
								title="Reject"
								className="size-8 border-[#E2E8F0] text-[#B91C1C] hover:bg-[#FEF2F2] hover:text-[#B91C1C] dark:border-[#1E293B]"
							>
								<X className="size-4" />
							</Button>
						) : null}
						{canApprove ? (
							<Button
								size="icon"
								disabled={approve.isPending}
								onClick={() => approveSubmission(row)}
								aria-label={`Approve ${row.employee.user.name}'s ${row.hoursWorked} h`}
								title="Approve"
								className="size-8 bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
							>
								{isApproving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
							</Button>
						) : null}
					</div>
				);
			},
		},
	];

	const emptyCopy = {
		PENDING: { title: "All caught up", description: "No work logs are waiting for review." },
		APPROVED: { title: "No approved work logs", description: "Approved hours will show up here." },
		REJECTED: { title: "No rejected work logs", description: "Work logs you send back will show up here." },
		ALL: { title: "No work logs yet", description: "Hours your team logs against tasks will show up here." },
	}[status] ?? { title: "No work logs", description: "" };

	return (
		<div className="space-y-6">
			<PageHeader
				title="Work hours"
				description="Review the hours your team logs. Approved hours are what hourly payroll pays."
			/>

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-2 border-b border-[#E2E8F0] p-4 @xl:flex-row @xl:flex-wrap @xl:items-center @xl:justify-between dark:border-[#1E293B]">
					<FilterTabs
						label="Filter by status"
						tabs={STATUS_TABS}
						value={status}
						onChange={(value) => apply({ status: value === "PENDING" ? null : value })}
					/>
					<EmployeeFilter
						value={employeeId}
						onChange={(value) => apply({ employeeId: value })}
						className="@xl:w-52"
					/>
				</div>

				{isQueue && rows.length > 0 ? (
					<p className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs text-[#64748B] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-[#94A3B8]">
						Oldest first, so nothing waits too long.
					</p>
				) : null}

				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(row) => row.id}
					isLoading={isLoading}
					onRowClick={openDetails}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={ClipboardCheck}
							title={isError ? "Couldn't load work hours" : employeeId ? "Nothing for this employee" : emptyCopy.title}
							description={
								isError
									? errorMessage(error, "Please try again in a moment.")
									: employeeId
										? "Try another status or clear the employee filter."
										: emptyCopy.description
							}
							action={
								employeeId ? (
									<Button variant="outline" onClick={() => apply({ employeeId: null })}>
										Show all employees
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

			<SubmissionSheet
				submission={selected}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				reviewerName={reviewerName(selected?.reviewedBy ?? null)}
				review={{
					isOwn: selected ? isOwn(selected) : false,
					isApproving: approve.isPending && approve.variables?.id === selected?.id,
					onApprove: approveSubmission,
					onReject: startReject,
				}}
			/>
			<RejectSubmissionDialog
				submission={rejecting}
				open={rejectOpen}
				onOpenChange={setRejectOpen}
				onRejected={() => setSheetOpen(false)}
			/>
		</div>
	);
}
