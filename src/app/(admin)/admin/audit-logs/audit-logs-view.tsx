"use client";

import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { ChevronRight, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DataTable,
	type DataTableColumn,
	EmptyState,
	PageHeader,
	TablePagination,
	UserAvatar,
} from "@/components/shared";
import { ActionBadge } from "@/components/audit/action-badge";
import { AuditLogSheet } from "@/components/audit/audit-log-sheet";
import { useAuditLogs } from "@/hooks/audit-log.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { useEmployeeOptions } from "@/hooks/employee.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { AUDIT_ACTION_GROUPS, describeAction, entityLabel } from "@/lib/audit";
import type { AuditLog } from "@/types/audit-log.type";

const ALL = "__all__";
const triggerClass =
	"h-9 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] @xl:w-48 dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white";
const contentClass = "border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]";

const timeAgo = (iso: string) => formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
const exactTime = (iso: string) =>
	new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export function AuditLogsView() {
	const { get, apply, page } = useUrlFilters();
	const entity = get("entity");
	const action = get("action");
	const userId = get("userId");
	const hasFilters = Boolean(entity || action || userId);

	const { data, isLoading } = useAuditLogs({ page, entity, action, userId });
	const { data: me } = useGetMe();
	const { data: employees = [] } = useEmployeeOptions();
	const [selected, setSelected] = useState<AuditLog | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);

	const rows = data?.rows ?? [];
	const meta = data?.meta;

	// The admin has no employee record, so add the signed-in user to the list
	const people = employees.map((employee) => ({ id: employee.user.id, name: employee.user.name }));
	if (me && !people.some((person) => person.id === me.id)) people.unshift({ id: me.id, name: me.name });

	const actionGroups = entity
		? AUDIT_ACTION_GROUPS.filter((group) => group.entity === entity)
		: AUDIT_ACTION_GROUPS;

	function openDetails(log: AuditLog) {
		setSelected(log);
		setSheetOpen(true);
	}

	const columns: DataTableColumn<AuditLog>[] = [
		{
			key: "event",
			header: "Event",
			cell: (row) => (
				<div className="min-w-0">
					<ActionBadge action={row.action} />
					<p className="mt-1.5 text-xs text-[#64748B] @lg:hidden dark:text-[#94A3B8]">
						{row.user.name} · {timeAgo(row.createdAt)}
					</p>
				</div>
			),
		},
		{
			key: "user",
			header: "Performed by",
			headerClassName: "hidden @lg:table-cell",
			className: "hidden @lg:table-cell",
			cell: (row) => (
				<div className="flex min-w-0 items-center gap-2.5">
					<UserAvatar name={row.user.name} size="sm" />
					<div className="min-w-0">
						<p className="truncate text-sm text-[#0F172A] dark:text-white">{row.user.name}</p>
						<p className="hidden truncate text-xs text-[#64748B] @3xl:block dark:text-[#94A3B8]">
							{row.user.email}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "entity",
			header: "Record",
			headerClassName: "hidden @2xl:table-cell",
			className: "hidden @2xl:table-cell",
			cell: (row) => (
				<div>
					<p className="text-sm text-[#0F172A] dark:text-white">{entityLabel(row.entity)}</p>
					{row.entityId ? (
						<p className="font-mono text-[11px] text-[#94A3B8]">#{row.entityId.slice(0, 8)}</p>
					) : null}
				</div>
			),
		},
		{
			key: "when",
			header: "When",
			headerClassName: "hidden @lg:table-cell",
			className: "hidden @lg:table-cell whitespace-nowrap",
			cell: (row) => (
				<time dateTime={row.createdAt} title={exactTime(row.createdAt)}>
					<span className="block text-sm text-[#0F172A] dark:text-white">{timeAgo(row.createdAt)}</span>
					<span className="block text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
						{exactTime(row.createdAt)}
					</span>
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
				title="Audit Logs"
				description="A permanent record of sign-ins, changes, approvals and payments across your organization."
			/>

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-2 border-b border-[#E2E8F0] p-4 @xl:flex-row @xl:flex-wrap @xl:items-center dark:border-[#1E293B]">
					<Select
						value={entity || ALL}
						onValueChange={(value) =>
							// A new entity can make the chosen action impossible, so reset it
							apply({ entity: value === ALL ? null : value, action: null })
						}
					>
						<SelectTrigger aria-label="Filter by record type" className={triggerClass}>
							<SelectValue placeholder="All records" />
						</SelectTrigger>
						<SelectContent className={contentClass}>
							<SelectItem value={ALL}>All records</SelectItem>
							{AUDIT_ACTION_GROUPS.map((group) => (
								<SelectItem key={group.entity} value={group.entity}>
									{entityLabel(group.entity)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={action || ALL} onValueChange={(value) => apply({ action: value === ALL ? null : value })}>
						<SelectTrigger aria-label="Filter by action" className={triggerClass}>
							<SelectValue placeholder="All actions" />
						</SelectTrigger>
						<SelectContent className={contentClass}>
							<SelectItem value={ALL}>All actions</SelectItem>
							{actionGroups.map((group) => (
								<SelectGroup key={group.entity}>
									<SelectLabel>{entityLabel(group.entity)}</SelectLabel>
									{group.actions.map((item) => (
										<SelectItem key={item} value={item}>
											{describeAction(item).label}
										</SelectItem>
									))}
								</SelectGroup>
							))}
						</SelectContent>
					</Select>

					<Select value={userId || ALL} onValueChange={(value) => apply({ userId: value === ALL ? null : value })}>
						<SelectTrigger aria-label="Filter by person" className={triggerClass}>
							<SelectValue placeholder="Everyone" />
						</SelectTrigger>
						<SelectContent className={contentClass}>
							<SelectItem value={ALL}>Everyone</SelectItem>
							{people.map((person) => (
								<SelectItem key={person.id} value={person.id}>
									{person.name}
									{person.id === me?.id ? <span className="text-[#94A3B8]"> (you)</span> : null}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{hasFilters ? (
						<Button
							variant="ghost"
							className="h-9 text-xs font-medium text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
							onClick={() => apply({ entity: null, action: null, userId: null })}
						>
							Clear
						</Button>
					) : null}
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
							icon={ScrollText}
							title="No activity found"
							description={hasFilters ? "Nothing matches these filters." : "Actions will appear here as people use EmNex."}
							action={
								hasFilters ? (
									<Button variant="outline" onClick={() => apply({ entity: null, action: null, userId: null })}>
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

			<AuditLogSheet log={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
		</div>
	);
}
