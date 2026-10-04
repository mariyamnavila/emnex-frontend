"use client";

import { useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { DetailList, DetailRow, formatStatus, SectionHeading, StatusBadge } from "@/components/shared";
import { useDepartments } from "@/hooks/department.hook";
import { useEmployeeOptions } from "@/hooks/employee.hook";
import { usePermissions, useRoles } from "@/hooks/role.hook";
import { useCopy } from "@/hooks/use-copy";
import { describeAction } from "@/lib/audit";
import { formatCurrency, toAmount } from "@/lib/pay";
import { cn, formatDay, formatRoleName, plural } from "@/lib/utils";
import type { AuditLog } from "@/types/audit-log.type";

type Metadata = Record<string, unknown>;
type Lookup = Map<string, string>;

const MONEY_KEY = /(amount|salary|hourlyrate|budget|deductions)$/i;
const HOURS_KEY = /(hours|hoursworked)$/i;
const DATE_KEY = /(date|start|end|at)$/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const ENUM = /^[A-Z][A-Z0-9_]+$/;

// "payrollId" → "Payroll ID", "netAmount" → "Net amount"
export const humanizeKey = (key: string) => {
	const words = key
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/_/g, " ")
		.toLowerCase();
	return (words.charAt(0).toUpperCase() + words.slice(1)).replace(/\bid(s?)\b/i, "ID$1");
};

const asText = (value: unknown) => (typeof value === "string" && value ? value : null);

// Old entries store ids only — resolve the ones the app already has cached
function useLookups(): Record<string, Lookup> {
	const { data: permissions = [] } = usePermissions();
	const { data: employees = [] } = useEmployeeOptions();
	const { data: roles = [] } = useRoles();
	const { data: departments = [] } = useDepartments();
	return {
		permission: new Map(permissions.map((p) => [p.id, p.name])),
		employee: new Map(employees.map((e) => [e.id, e.user.name])),
		role: new Map(roles.map((r) => [r.id, formatRoleName(r.name)])),
		department: new Map(departments.map((d) => [d.id, d.name])),
	};
}

// "permissionIds" reads better as "Permissions" once the ids are resolved
const fieldLabel = (key: string, value: unknown, lookup?: Lookup) => {
	if (key === "total") return "Total permissions";
	if (!lookup) return humanizeKey(key);
	const base = humanizeKey(key.replace(/Ids?$/, ""));
	return Array.isArray(value) ? `${base}s` : base;
};

const lookupFor = (key: string, lookups: Record<string, Lookup>): Lookup | undefined => {
	if (/^permissionIds?$/i.test(key)) return lookups.permission;
	if (/^employeeIds?$/i.test(key)) return lookups.employee;
	if (/^roleIds?$/i.test(key)) return lookups.role;
	if (/^departmentIds?$/i.test(key)) return lookups.department;
	return undefined;
};

// One-line, plain-English description of the event
function summarize(log: AuditLog, lookups: Record<string, Lookup>): string {
	const m: Metadata = log.metadata ?? {};
	const { label } = describeAction(log.action);
	const role = asText(m.roleName) ? formatRoleName(String(m.roleName)) : null;
	const byId = (lookup: Lookup, id: unknown) => (typeof id === "string" ? (lookup.get(id) ?? null) : null);
	const subject =
		asText(m.employeeName) ??
		asText(m.taskTitle) ??
		asText(m.projectName) ??
		asText(m.departmentName) ??
		role ??
		asText(m.email) ??
		byId(lookups.employee, m.employeeId) ??
		byId(lookups.department, m.departmentId);
	const plain = (value: unknown) =>
		typeof value === "string" && ENUM.test(value) ? formatStatus(value) : String(value ?? "none");
	const money = toAmount((m.amount ?? m.netAmount) as string | number | null | undefined);

	if (log.action === "ASSIGN_PERMISSIONS") {
		if (Array.isArray(m.added) && Array.isArray(m.removed)) {
			const { length: added } = m.added;
			const { length: removed } = m.removed;
			const on = role ? ` on ${role}` : "";
			if (added && removed) return `Added ${added} and removed ${removed} permissions${on}`;
			if (added) return `Added ${plural(added, "permission")}${on}`;
			if (removed) return `Removed ${plural(removed, "permission")}${role ? ` from ${role}` : ""}`;
			return `Saved permissions${on} with no changes`;
		}
		if (Array.isArray(m.permissionIds)) return `Set ${m.permissionIds.length} permissions on this role`;
	}
	if (m.from !== undefined && m.to !== undefined) {
		return `${subject ? `${subject}: ` : ""}${plain(m.from)} → ${plain(m.to)}`;
	}
	if (m.changes && typeof m.changes === "object") {
		const fields = Object.entries(m.changes as Record<string, { from: unknown; to: unknown }>);
		const on = subject ? ` on ${subject}` : "";
		if (fields.length === 1 && fields[0][0] === "status") {
			return `${subject ? `${subject}: ` : ""}${plain(fields[0][1]?.from)} → ${plain(fields[0][1]?.to)}`;
		}
		if (fields.length === 1) return `Changed ${humanizeKey(fields[0][0]).toLowerCase()}${on}`;
		return `Changed ${fields.length} fields${on}`;
	}
	if (money !== null) return `${label}${subject ? ` for ${subject}` : ""} · ${formatCurrency(money)}`;
	return subject ? `${label} · ${subject}` : label;
}

export function AuditSummary({ log }: { log: AuditLog }) {
	const lookups = useLookups();
	return (
		<p className="text-[15px] leading-snug font-medium text-[#0F172A] dark:text-white">{summarize(log, lookups)}</p>
	);
}

function ShortId({ id }: { id: string }) {
	const { copied, copy } = useCopy();
	return (
		<button
			type="button"
			title={`${id} — click to copy`}
			onClick={() => copy(id)}
			className="inline-flex items-center gap-1 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 font-mono text-[11px] text-[#334155] hover:border-[#CBD5E1] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-[#CBD5E1]"
		>
			#{id.slice(0, 8)}
			{copied ? <Check className="size-3 text-[#16A34A]" /> : <Copy className="size-3 text-[#94A3B8]" />}
		</button>
	);
}

// Formats one value by its key and shape
function Value({ name, value, lookup }: { name: string; value: unknown; lookup?: Lookup }) {
	if (value === null || value === undefined || value === "") return <span className="text-[#94A3B8]">—</span>;
	if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;

	if (MONEY_KEY.test(name)) {
		const amount = toAmount(value as string | number);
		if (amount !== null) return <span className="font-medium tabular-nums">{formatCurrency(amount)}</span>;
	}
	if (HOURS_KEY.test(name)) {
		const hours = toAmount(value as string | number);
		if (hours !== null) return <span className="tabular-nums">{hours} h</span>;
	}
	if (typeof value === "string") {
		if (UUID.test(value)) {
			const resolved = lookup?.get(value);
			return resolved ? <span>{resolved}</span> : <ShortId id={value} />;
		}
		if (ISO_DATE.test(value) && (DATE_KEY.test(name) || name === "from" || name === "to")) {
			const date = new Date(value);
			const dateOnly = value.includes("T00:00:00.000Z") || /T23:59:59\.999Z$/.test(value);
			return (
				<span className="tabular-nums">
					{dateOnly
						? formatDay(date)
						: date.toLocaleString("en-US", {
								dateStyle: "medium",
								timeStyle: "short",
							})}
				</span>
			);
		}
		if (ENUM.test(value) && value.length > 2) {
			return name === "roleName" ? <span>{formatRoleName(value)}</span> : <StatusBadge status={value} />;
		}
		return <span className="wrap-break-word">{value}</span>;
	}
	if (typeof value === "number") return <span className="tabular-nums">{value.toLocaleString("en-US")}</span>;
	if (Array.isArray(value)) return <Chips items={value} lookup={lookup} />;
	return (
		<pre className="max-h-48 overflow-auto rounded-md bg-[#F8FAFC] p-2 font-mono text-[11px] text-[#334155] dark:bg-[#0B1120] dark:text-[#CBD5E1]">
			{JSON.stringify(value, null, 2)}
		</pre>
	);
}

function Chips({
	items,
	lookup,
	tone = "neutral",
}: {
	items: unknown[];
	lookup?: Lookup;
	tone?: "neutral" | "added" | "removed";
}) {
	const [expanded, setExpanded] = useState(false);
	if (items.length === 0) return <span className="text-[#94A3B8]">None</span>;
	const LIMIT = 6;
	const shown = expanded ? items : items.slice(0, LIMIT);
	const label = (item: unknown) => {
		const text = String(item);
		return lookup?.get(text) ?? (UUID.test(text) ? `#${text.slice(0, 8)}` : text);
	};
	return (
		<span className="flex flex-wrap gap-1.5">
			{shown.map((item, index) => (
				<span
					key={`${String(item)}-${index}`}
					title={String(item)}
					className={cn(
						"rounded-md border px-1.5 py-0.5 font-mono text-[11px]",
						tone === "added" && "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
						tone === "removed" && "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C] line-through decoration-[#B91C1C]/40",
						tone === "neutral" &&
							"border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-[#CBD5E1]",
					)}
				>
					{label(item)}
				</span>
			))}
			{items.length > LIMIT ? (
				<button
					type="button"
					onClick={() => setExpanded((open) => !open)}
					className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-[#2563EB] hover:bg-[#EFF6FF]"
				>
					{expanded ? "Show less" : `+${items.length - LIMIT} more`}
				</button>
			) : null}
		</span>
	);
}

export function AuditMetadata({ log }: { log: AuditLog }) {
	const lookups = useLookups();
	const metadata: Metadata = log.metadata ?? {};
	const changes =
		metadata.changes && typeof metadata.changes === "object"
			? Object.entries(metadata.changes as Record<string, { from: unknown; to: unknown }>)
			: [];
	const added = Array.isArray(metadata.added) ? metadata.added : null;
	const removed = Array.isArray(metadata.removed) ? metadata.removed : null;
	const hasTransition = metadata.from !== undefined && metadata.to !== undefined;
	const rest = Object.entries(metadata).filter(
		([key]) => !["changes", "added", "removed", ...(hasTransition ? ["from", "to"] : [])].includes(key),
	);

	if (Object.keys(metadata).length === 0) {
		return <p className="text-sm text-[#94A3B8]">No extra details were recorded.</p>;
	}

	return (
		<div className="space-y-6">
			{hasTransition ? (
				<div className="space-y-2">
					<SectionHeading>Change</SectionHeading>
					<p className="flex flex-wrap items-center gap-2 text-sm">
						<Value name="from" value={metadata.from} />
						<ArrowRight className="size-4 text-[#94A3B8]" aria-hidden="true" />
						<Value name="to" value={metadata.to} />
					</p>
				</div>
			) : null}

			{changes.length > 0 ? (
				<div className="space-y-2">
					<SectionHeading>What changed</SectionHeading>
					<div className="overflow-hidden rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
						{changes.map(([field, change]) => {
							const long = [change?.from, change?.to].some((v) => typeof v === "string" && v.length > 24);
							return (
								<div
									key={field}
									className="grid gap-1 border-b border-[#F1F5F9] px-3 py-2.5 text-sm last:border-b-0 sm:grid-cols-[110px_minmax(0,1fr)] dark:border-[#1E293B]"
								>
									<span className="text-[#64748B] dark:text-[#94A3B8]">{humanizeKey(field)}</span>
									<span className={cn("flex gap-x-2 gap-y-1", long ? "flex-col" : "flex-wrap items-center")}>
										<span className="text-[#64748B] line-through decoration-[#94A3B8]/60">
											<Value name={field} value={change?.from} />
										</span>
										{long ? null : <ArrowRight className="size-3.5 shrink-0 text-[#94A3B8]" aria-hidden="true" />}
										<span className="font-medium">
											<Value name={field} value={change?.to} />
										</span>
									</span>
								</div>
							);
						})}
					</div>
				</div>
			) : null}

			{added || removed ? (
				<div className="space-y-3">
					<SectionHeading>Permissions</SectionHeading>
					<dl className="space-y-3 text-sm">
						{added?.length || !removed?.length ? (
							<div>
								<dt className="mb-1.5 text-xs font-medium text-[#15803D]">Added ({added?.length ?? 0})</dt>
								<dd>
									<Chips items={added ?? []} tone="added" lookup={lookups.permission} />
								</dd>
							</div>
						) : null}
						{removed?.length || !added?.length ? (
							<div>
								<dt className="mb-1.5 text-xs font-medium text-[#B91C1C]">Removed ({removed?.length ?? 0})</dt>
								<dd>
									<Chips items={removed ?? []} tone="removed" lookup={lookups.permission} />
								</dd>
							</div>
						) : null}
					</dl>
				</div>
			) : null}

			{rest.length > 0 ? (
				<div>
					<SectionHeading>Details</SectionHeading>
					<DetailList bordered={false} className="mt-1">
						{rest.map(([key, value]) => {
							const lookup = lookupFor(key, lookups);
							return (
								<DetailRow key={key} label={fieldLabel(key, value, lookup)}>
									<Value name={key} value={value} lookup={lookup} />
								</DetailRow>
							);
						})}
					</DetailList>
				</div>
			) : null}

			<details className="group rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
				<summary className="cursor-pointer px-3 py-2 text-xs font-medium text-[#64748B] select-none hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white">
					Show raw data
				</summary>
				<pre className="max-h-72 overflow-auto border-t border-[#E2E8F0] p-3 font-mono text-[11px] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]">
					{JSON.stringify(metadata, null, 2)}
				</pre>
			</details>
		</div>
	);
}
