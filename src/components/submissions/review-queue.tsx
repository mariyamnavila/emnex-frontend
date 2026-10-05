"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Loader2, X } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useCan, useCurrentUser } from "@/hooks/auth.hook";
import { useApproveSubmission, useSubmissions } from "@/hooks/submission.hook";
import { formatDay, plural, timeAgo } from "@/lib/utils";
import type { Submission } from "@/types/submission.type";
import { RejectSubmissionDialog } from "./reject-submission-dialog";

interface ReviewQueueProps {
	limit?: number;
	className?: string;
}

// Oldest pending work logs first, with approve / reject right in the list
export function ReviewQueue({ limit = 5, className }: ReviewQueueProps) {
	const { data, isLoading, isError } = useSubmissions({ status: "PENDING", limit, oldestFirst: true });
	const approve = useApproveSubmission();
	const currentUser = useCurrentUser();
	const can = useCan();
	const canApprove = can("submission.approve");
	const canReject = can("submission.reject");
	const [rejecting, setRejecting] = useState<Submission | null>(null);
	const [rejectOpen, setRejectOpen] = useState(false);
	const rows = data?.rows ?? [];
	const total = data?.meta?.total ?? rows.length;

	return (
		<ChartCard
			title="Pending approvals"
			description={
				total > 0
					? `${plural(total, "work log")} waiting · oldest first`
					: "Work logs your team submits show up here"
			}
			isLoading={isLoading}
			isError={isError}
			className={className}
			action={
				<Link
					href="/manager/submissions"
					className="text-xs font-medium text-[#2563EB] hover:underline dark:text-[#60A5FA]"
				>
					View all
				</Link>
			}
		>
			{rows.length === 0 ? (
				<div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
					<CheckCircle2 className="size-7 text-[#16A34A]" aria-hidden="true" />
					<p className="text-sm font-medium text-[#0F172A] dark:text-white">All caught up</p>
					<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">No work logs are waiting for review.</p>
				</div>
			) : (
				<ul className="divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
					{rows.map((submission) => {
						const isOwn = submission.employee.user.id === currentUser.id;
						const isApproving = approve.isPending && approve.variables?.id === submission.id;
						return (
							<li key={submission.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start">
								<UserAvatar name={submission.employee.user.name} src={submission.employee.user.avatar} size="sm" className="mt-0.5 hidden sm:flex" />
								<div className="min-w-0 flex-1 space-y-1">
									<div className="flex items-baseline justify-between gap-3">
										<p className="truncate text-sm font-medium text-[#0F172A] dark:text-white">
											{submission.employee.user.name}
											{isOwn ? (
												<span className="ml-2 text-xs font-normal text-[#64748B]">(you)</span>
											) : null}
										</p>
										<span className="shrink-0 text-sm font-semibold text-[#0F172A] tabular-nums dark:text-white">
											{submission.hoursWorked} h
										</span>
									</div>
									<p className="truncate text-xs text-[#334155] dark:text-[#CBD5E1]">
										{submission.task.title}
										{submission.task.project ? (
											<span className="text-[#64748B] dark:text-[#94A3B8]"> · {submission.task.project.name}</span>
										) : null}
									</p>
									{submission.description ? (
										<p className="line-clamp-2 text-xs text-[#64748B] dark:text-[#94A3B8]">{submission.description}</p>
									) : null}
									<p className="text-[11px] text-[#94A3B8] tabular-nums">
										Worked {formatDay(new Date(submission.workDate))} · submitted{" "}
										<time dateTime={submission.createdAt}>
											{timeAgo(submission.createdAt)}
										</time>
									</p>
								</div>
								<div className="flex shrink-0 gap-2 sm:flex-col">
									{canApprove ? (
										<Button
											size="sm"
											disabled={isOwn || approve.isPending}
											title={isOwn ? "You can't review your own work" : undefined}
											onClick={() => approve.mutate(submission)}
											className="flex-1 bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8] sm:w-24 sm:flex-none"
										>
											{isApproving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
											Approve
										</Button>
									) : null}
									{canReject ? (
										<Button
											size="sm"
											variant="outline"
											disabled={isOwn || isApproving}
											title={isOwn ? "You can't review your own work" : undefined}
											onClick={() => {
												setRejecting(submission);
												setRejectOpen(true);
											}}
											className="flex-1 border-[#E2E8F0] text-[#B91C1C] hover:bg-[#FEF2F2] hover:text-[#B91C1C] sm:w-24 sm:flex-none dark:border-[#1E293B]"
										>
											<X className="size-3.5" />
											Reject
										</Button>
									) : null}
								</div>
							</li>
						);
					})}
				</ul>
			)}
			<RejectSubmissionDialog
				submission={rejecting}
				open={rejectOpen}
				onOpenChange={setRejectOpen}
			/>
		</ChartCard>
	);
}
