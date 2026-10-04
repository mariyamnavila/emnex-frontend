"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import { StatusBadge, UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDay } from "@/lib/utils";
import type { Submission } from "@/types/submission.type";

const exactTime = (iso: string) =>
	new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

function Row({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 py-2.5 text-sm">
			<dt className="text-[#64748B] dark:text-[#94A3B8]">{label}</dt>
			<dd className="min-w-0 text-[#0F172A] dark:text-white">{children}</dd>
		</div>
	);
}

interface SubmissionSheetProps {
	submission: Submission | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Who reviewed it, already resolved from `reviewedBy` */
	reviewerName: string | null;
	/** Own work can't be reviewed */
	isOwn: boolean;
	isApproving: boolean;
	onApprove: (submission: Submission) => void;
	onReject: (submission: Submission) => void;
}

export function SubmissionSheet({
	submission,
	open,
	onOpenChange,
	reviewerName,
	isOwn,
	isApproving,
	onApprove,
	onReject,
}: SubmissionSheetProps) {
	const canReview = submission?.status === "PENDING" && !isOwn;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				onOpenAutoFocus={(event) => event.preventDefault()}
				className="w-full gap-0 overflow-y-auto border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]"
			>
				<SheetHeader className="border-b border-[#E2E8F0] pb-4 dark:border-[#1E293B]">
					<SheetTitle className="text-base text-[#0F172A] dark:text-white">Work log</SheetTitle>
					<SheetDescription className="text-xs">Hours logged against a task, and how they were reviewed</SheetDescription>
				</SheetHeader>

				{submission ? (
					<div className="flex flex-1 flex-col">
						<div className="flex-1 space-y-6 p-5">
							<div className="flex items-center gap-3">
								<UserAvatar name={submission.employee.user.name} src={submission.employee.user.avatar} />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-[#0F172A] dark:text-white">
										{submission.employee.user.name}
										{isOwn ? <span className="ml-1.5 text-xs font-normal text-[#64748B]">(you)</span> : null}
									</p>
									<p className="truncate font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">
										{submission.employee.employeeCode}
									</p>
								</div>
								<StatusBadge status={submission.status} />
							</div>

							<div className="rounded-lg border border-[#E2E8F0] p-4 dark:border-[#1E293B]">
								<p className="text-3xl font-bold text-[#0F172A] tabular-nums dark:text-white">
									{submission.hoursWorked} h
								</p>
								<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
									worked on {formatDay(new Date(submission.workDate))}
								</p>
							</div>

							<dl className="divide-y divide-[#F1F5F9] border-y border-[#F1F5F9] dark:divide-[#1E293B] dark:border-[#1E293B]">
								<Row label="Task">{submission.task.title}</Row>
								{submission.task.project ? <Row label="Project">{submission.task.project.name}</Row> : null}
								<Row label="Submitted">
									<time dateTime={submission.createdAt} className="tabular-nums">
										{exactTime(submission.createdAt)}
									</time>
									<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">
										{formatDistanceToNowStrict(new Date(submission.createdAt), { addSuffix: true })}
									</span>
								</Row>
								{submission.reviewedAt ? (
									<Row label={submission.status === "REJECTED" ? "Rejected" : "Approved"}>
										<time dateTime={submission.reviewedAt} className="tabular-nums">
											{exactTime(submission.reviewedAt)}
										</time>
										{reviewerName ? (
											<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">by {reviewerName}</span>
										) : null}
									</Row>
								) : null}
							</dl>

							<div className="space-y-2">
								<h3 className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
									What they did
								</h3>
								<p className="text-sm whitespace-pre-line text-[#334155] dark:text-[#CBD5E1]">
									{submission.description || "No description given."}
								</p>
							</div>

							{submission.reviewNote ? (
								submission.status === "REJECTED" ? (
									<div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 dark:border-[#7F1D1D] dark:bg-[#450A0A]/40">
										<p className="text-xs font-semibold text-[#B91C1C] dark:text-[#FCA5A5]">Reason for rejection</p>
										<p className="mt-1 text-sm whitespace-pre-line text-[#7F1D1D] dark:text-[#FECACA]">
											{submission.reviewNote}
										</p>
									</div>
								) : (
									<div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 dark:border-[#1E293B] dark:bg-[#0B1120]">
										<p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Reviewer&apos;s note</p>
										<p className="mt-1 text-sm whitespace-pre-line text-[#334155] dark:text-[#CBD5E1]">
											{submission.reviewNote}
										</p>
									</div>
								)
							) : null}
						</div>

						{submission.status === "PENDING" ? (
							<div className="sticky bottom-0 border-t border-[#E2E8F0] bg-white p-4 dark:border-[#1E293B] dark:bg-[#0F172A]">
								{isOwn ? (
									<p className="mb-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
										This is your own work log — someone else has to review it.
									</p>
								) : null}
								<div className="flex gap-2">
									<Button
										variant="outline"
										disabled={!canReview || isApproving}
										onClick={() => onReject(submission)}
										className="flex-1 border-[#E2E8F0] text-[#B91C1C] hover:bg-[#FEF2F2] hover:text-[#B91C1C] dark:border-[#1E293B]"
									>
										<X className="size-4" />
										Reject
									</Button>
									<Button
										disabled={!canReview || isApproving}
										onClick={() => onApprove(submission)}
										className="flex-1 bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
									>
										{isApproving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
										Approve {submission.hoursWorked} h
									</Button>
								</div>
							</div>
						) : null}
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
