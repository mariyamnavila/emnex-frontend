"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserAvatar } from "@/components/shared";
import { entityLabel } from "@/lib/audit";
import type { AuditLog } from "@/types/audit-log.type";
import { ActionBadge } from "./action-badge";
import { AuditMetadata, AuditSummary, Row } from "./audit-metadata";
import { formatDateTime, timeAgo } from "@/lib/utils";

interface AuditLogSheetProps {
	log: AuditLog | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AuditLogSheet({ log, open, onOpenChange }: AuditLogSheetProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				onOpenAutoFocus={(event) => event.preventDefault()}
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
							<AuditSummary log={log} />
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
									{formatDateTime(log.createdAt, { seconds: true })}
								</time>
								<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">
									{timeAgo(log.createdAt)}
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

						<AuditMetadata log={log} />
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
