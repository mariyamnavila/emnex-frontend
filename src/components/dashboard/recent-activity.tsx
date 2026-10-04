"use client";

import Link from "next/link";
import { describeAction, entityLabel } from "@/lib/audit";
import { UserAvatar } from "@/components/shared";
import { useRecentActivity } from "@/hooks/analytics.hook";
import { ChartCard } from "./chart-card";
import { timeAgo } from "@/lib/utils";

export function RecentActivity({ className }: { className?: string }) {
	const { data: logs = [], isLoading, isError } = useRecentActivity();

	return (
		<ChartCard
			title="Recent activity"
			description="Latest actions across your organization"
			isLoading={isLoading}
			isError={isError}
			isEmpty={logs.length === 0}
			emptyText="No activity recorded yet."
			className={className}
			action={
				<Link
					href="/admin/audit-logs"
					className="text-xs font-medium text-[#2563EB] hover:underline dark:text-[#60A5FA]"
				>
					View all
				</Link>
			}
		>
			<ul className="divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
				{logs.map((log) => (
					<li key={log.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
						<UserAvatar name={log.user.name} size="sm" className="mt-0.5" />
						<div className="min-w-0 flex-1">
							<p className="text-sm text-[#334155] dark:text-[#CBD5E1]">
								<span className="font-medium text-[#0F172A] dark:text-white">
									{log.user.name}
								</span>{" "}
								{describeAction(log.action).label.toLowerCase()}
							</p>
							<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
								{entityLabel(log.entity)} ·{" "}
								<time dateTime={log.createdAt}>
									{timeAgo(log.createdAt)}
								</time>
							</p>
						</div>
					</li>
				))}
			</ul>
		</ChartCard>
	);
}
