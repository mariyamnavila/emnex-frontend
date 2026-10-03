"use client";

import { formatDistanceToNowStrict } from "date-fns";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { UserAvatar } from "@/components/shared";
import { entityLabel } from "@/lib/audit";
import type { AuditLog } from "@/types/audit-log.type";
import { ActionBadge } from "./action-badge";

// "payrollId" → "Payroll ID", "netAmount" → "Net amount"
const humanizeKey = (key: string) => {
	const words = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase();
	return (words.charAt(0).toUpperCase() + words.slice(1)).replace(/\bid\b/i, "ID");
};

function MetadataValue({ value }: { value: unknown }) {
	if (value === null || value === undefined || value === "") {
		return <span className="text-[#94A3B8]">—</span>;
	}
	if (typeof value === "object") {
		return (
			<pre className="max-h-48 overflow-auto rounded-md bg-[#F8FAFC] p-2 text-left font-mono text-[11px] text-[#334155] dark:bg-[#0B1120] dark:text-[#CBD5E1]">
				{JSON.stringify(value, null, 2)}
			</pre>
		);
	}
	return <span className="break-all">{String(value)}</span>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 text-sm">
			<dt className="text-[#64748B] dark:text-[#94A3B8]">{label}</dt>
			<dd className="min-w-0 text-[#0F172A] dark:text-white">{children}</dd>
		</div>
	);
}

interface AuditLogSheetProps {
	log: AuditLog | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AuditLogSheet({ log, open, onOpenChange }: AuditLogSheetProps) {
	const metadata = log?.metadata ? Object.entries(log.metadata) : [];

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full gap-0 overflow-y-auto border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]"
			>
				<SheetHeader className="border-b border-[#E2E8F0] pb-4 dark:border-[#1E293B]">
					<SheetTitle className="text-base text-[#0F172A] dark:text-white">Activity details</SheetTitle>
					<SheetDescription className="text-xs">Who did what, to which record, and when</SheetDescription>
				</SheetHeader>

				{log ? (
					<div className="space-y-6 p-5">
						<div className="space-y-3">
							<ActionBadge action={log.action} />
							<div className="flex items-center gap-3">
								<UserAvatar name={log.user.name} />
								<div className="min-w-0">
									<p className="truncate text-sm font-medium text-[#0F172A] dark:text-white">{log.user.name}</p>
									<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{log.user.email}</p>
								</div>
							</div>
						</div>

						<dl className="divide-y divide-[#F1F5F9] border-y border-[#F1F5F9] dark:divide-[#1E293B] dark:border-[#1E293B]">
							<Row label="When">
								<time dateTime={log.createdAt} className="tabular-nums">
									{new Date(log.createdAt).toLocaleString("en-US", {
										dateStyle: "medium",
										timeStyle: "medium",
									})}
								</time>
								<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">
									{formatDistanceToNowStrict(new Date(log.createdAt), { addSuffix: true })}
								</span>
							</Row>
							<Row label="Record">{entityLabel(log.entity)}</Row>
							<Row label="Record ID">
								<span className="font-mono text-xs break-all">{log.entityId ?? "—"}</span>
							</Row>
							<Row label="IP address">
								<span className="font-mono text-xs">{log.ipAddress ?? "Not recorded"}</span>
							</Row>
							<Row label="Action code">
								<span className="font-mono text-xs">{log.action}</span>
							</Row>
						</dl>

						<div>
							<h3 className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
								Details
							</h3>
							{metadata.length === 0 ? (
								<p className="mt-2 text-sm text-[#94A3B8]">No extra details were recorded.</p>
							) : (
								<dl className="mt-1 divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
									{metadata.map(([key, value]) => (
										<Row key={key} label={humanizeKey(key)}>
											<MetadataValue value={value} />
										</Row>
									))}
								</dl>
							)}
						</div>
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
