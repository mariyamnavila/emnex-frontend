"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, ClipboardList, Clock, Hourglass, Pencil, RotateCcw, XCircle } from "lucide-react";
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
import { SubmissionSheet } from "@/components/submissions/submission-sheet";
import { LogHoursDialog } from "@/components/tasks/log-hours-dialog";
import { canLogHours } from "@/components/tasks/my-task-actions";
import { useMySubmissions } from "@/hooks/submission.hook";
import { useMyTasks } from "@/hooks/task.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { errorMessage } from "@/lib/api";
import { sumHours } from "@/lib/task";
import { formatDay, plural, timeAgo } from "@/lib/utils";
import type { MySubmission, SubmissionStatus } from "@/types/submission.type";
import { type LogHoursValues, workLogToForm } from "@/validation/submission.validation";

const PAGE_SIZE = 10;

const STATUSES: { value: SubmissionStatus; label: string }[] = [
	{ value: "PENDING", label: "Pending" },
	{ value: "APPROVED", label: "Approved" },
	{ value: "REJECTED", label: "Rejected" },
];


type DialogState = { initial?: Partial<LogHoursValues>; editing?: { id: string; taskTitle: string } } | null;

export function MySubmissionsView() {
	const { get, apply, page } = useUrlFilters();
	const status = get("status") as SubmissionStatus | "";

	const logs = useMySubmissions();
	const tasks = useMyTasks();

	const [selected, setSelected] = useState<MySubmission | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [dialog, setDialog] = useState<DialogState>(null);

	const all = logs.data ?? [];
	const byStatus = (value: SubmissionStatus) => all.filter((log) => log.status === value);
	const filtered = status ? byStatus(status) : all;
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const loggable = (tasks.data ?? []).filter(canLogHours);

	function openLog(state: NonNullable<DialogState>) {
		setSheetOpen(false);
		setDialog(state);
	}

	// Pending logs can be edited; a rejected one is sent again as a new log
	const sheetActions = (log: MySubmission) => {
		if (log.status === "PENDING") {
			return (
				<Button
					onClick={() => openLog({ initial: workLogToForm(log), editing: { id: log.id, taskTitle: log.task.title } })}
					className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					<Pencil className="size-4" />
					Edit work log
				</Button>
			);
		}
		if (log.status === "REJECTED" && loggable.some((task) => task.id === log.taskId)) {
			return (
				<Button
					onClick={() => openLog({ initial: workLogToForm(log) })}
					className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					<RotateCcw className="size-4" />
					Fix and log again
				</Button>
			);
		}
		return null;
	};

	const columns: DataTableColumn<MySubmission>[] = [
		{
			key: "day",
			header: "Day",
			className: "whitespace-normal @2xl:whitespace-nowrap",
			cell: (row) => (
				<div className="min-w-0">
					<p className="text-sm font-medium text-[#0F172A] tabular-nums dark:text-white">{formatDay(row.workDate)}</p>
					<p className="line-clamp-2 text-xs text-[#64748B] @2xl:hidden dark:text-[#94A3B8]">{row.task.title}</p>
					<div className="mt-1.5 @lg:hidden">
						<StatusBadge status={row.status} />
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
				<div className="max-w-64 min-w-0">
					<p className="truncate text-sm text-[#0F172A] dark:text-white">{row.task.title}</p>
					{row.task.project ? (
						<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{row.task.project.name}</p>
					) : null}
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
			headerClassName: "hidden @lg:table-cell",
			className: "hidden @lg:table-cell",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "submitted",
			header: "Submitted",
			headerClassName: "hidden @4xl:table-cell",
			className: "hidden @4xl:table-cell whitespace-nowrap text-sm text-[#334155] dark:text-[#CBD5E1]",
			cell: (row) => <time dateTime={row.createdAt}>{timeAgo(row.createdAt)}</time>,
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

	const pending = byStatus("PENDING");
	const approved = byStatus("APPROVED");
	const rejected = byStatus("REJECTED");

	return (
		<div className="space-y-6">
			<PageHeader
				title="My Submissions"
				description="Every work log you've sent, and how your manager reviewed it."
				actions={
					<Button
						onClick={() => openLog({})}
						disabled={loggable.length === 0}
						className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
					>
						<Clock className="size-4" />
						Log hours
					</Button>
				}
			/>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Hours logged"
					isLoading={logs.isLoading}
					value={logs.isError ? "—" : `${sumHours(all)} h`}
					icon={ClipboardList}
					hint={plural(all.length, "work log")}
				/>
				<StatCard
					title="Approved"
					isLoading={logs.isLoading}
					value={logs.isError ? "—" : `${sumHours(approved)} h`}
					icon={CheckCircle2}
					hint="Counts toward hourly pay"
				/>
				<StatCard
					title="In review"
					isLoading={logs.isLoading}
					value={logs.isError ? "—" : `${sumHours(pending)} h`}
					icon={Hourglass}
					hint={`${pending.length} waiting for your manager`}
				/>
				<StatCard
					title="Rejected"
					isLoading={logs.isLoading}
					value={logs.isError ? "—" : rejected.length}
					icon={XCircle}
					hint={rejected.length > 0 ? "Open one to see why" : "Nothing sent back"}
				/>
			</div>

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="border-b border-[#E2E8F0] p-4 dark:border-[#1E293B]">
					<StatusFilter
						label="Filter by status"
						value={status}
						onChange={(value) => apply({ status: value })}
						tabs={[
							{ value: "", label: "All", count: logs.isLoading ? undefined : all.length },
							...STATUSES.map((item) => ({
								value: item.value,
								label: item.label,
								count: logs.isLoading ? undefined : byStatus(item.value).length,
							})),
						]}
					/>
				</div>

				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(row) => row.id}
					isLoading={logs.isLoading}
					onRowClick={(row) => {
						setSelected(row);
						setSheetOpen(true);
					}}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={ClipboardList}
							title={logs.isError ? "Your work logs couldn't be loaded" : status ? "No work logs here" : "No work logs yet"}
							description={
								logs.isError
									? errorMessage(logs.error, "Please try again in a moment.")
									: status
										? "Try another status."
										: "Log hours on one of your tasks and it will show up here."
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
					<TablePagination page={page} totalPages={totalPages} total={filtered.length} isLoading={logs.isLoading} />
				</div>
			</section>

			<SubmissionSheet
				submission={selected}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				actions={selected ? sheetActions(selected) : null}
			/>
			<LogHoursDialog
				open={dialog !== null}
				onOpenChange={(open) => !open && setDialog(null)}
				tasks={loggable}
				initial={dialog?.initial}
				editing={dialog?.editing ?? null}
			/>
		</div>
	);
}
