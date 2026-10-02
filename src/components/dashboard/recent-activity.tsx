"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { UserAvatar } from "@/components/shared";
import { useRecentActivity } from "@/hooks/analytics.hook";
import { ChartCard } from "./chart-card";

// "GENERATE_PAYROLL" → "generate payroll"
const describeAction = (action: string) => action.toLowerCase().replace(/_/g, " ");

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
								{describeAction(log.action)}
							</p>
							<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
								{log.entity} ·{" "}
								<time dateTime={log.createdAt}>
									{formatDistanceToNowStrict(new Date(log.createdAt), {
										addSuffix: true,
									})}
								</time>
							</p>
						</div>
					</li>
				))}
			</ul>
		</ChartCard>
	);
}
