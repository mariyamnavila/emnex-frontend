"use client";

import { DetailList, DetailRow, DetailSheet, PersonLine } from "@/components/shared";
import { entityLabel } from "@/lib/audit";
import { formatDateTime, timeAgo } from "@/lib/utils";
import type { AuditLog } from "@/types/audit-log.type";
import { ActionBadge } from "./action-badge";
import { AuditMetadata, AuditSummary } from "./audit-metadata";

interface AuditLogSheetProps {
	log: AuditLog | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AuditLogSheet({ log, open, onOpenChange }: AuditLogSheetProps) {
	return (
		<DetailSheet
			open={open}
			onOpenChange={onOpenChange}
			title="Activity details"
			description="Who did what, to which record, and when"
		>
			{log ? (
				<>
					<div className="space-y-3">
						<ActionBadge action={log.action} />
						<AuditSummary log={log} />
						<PersonLine name={log.user.name} subtitle={log.user.email} />
					</div>

					<DetailList>
						<DetailRow label="When">
							<time dateTime={log.createdAt} className="tabular-nums">
								{formatDateTime(log.createdAt, { seconds: true })}
							</time>
							<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">{timeAgo(log.createdAt)}</span>
						</DetailRow>
						<DetailRow label="Record">{entityLabel(log.entity)}</DetailRow>
						<DetailRow label="Record ID">
							<span className="font-mono text-xs break-all">{log.entityId ?? "—"}</span>
						</DetailRow>
						<DetailRow label="IP address">
							<span className="font-mono text-xs">{log.ipAddress ?? "Not recorded"}</span>
						</DetailRow>
						<DetailRow label="Action code">
							<span className="font-mono text-xs">{log.action}</span>
						</DetailRow>
					</DetailList>

					<AuditMetadata log={log} />
				</>
			) : null}
		</DetailSheet>
	);
}
