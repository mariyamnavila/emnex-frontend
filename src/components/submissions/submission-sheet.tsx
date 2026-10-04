"use client";

import { Check, Loader2, X } from "lucide-react";
import {
	DetailFigure,
	DetailList,
	DetailRow,
	DetailSheet,
	PersonLine,
	SectionHeading,
	StatusBadge,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatDay, timeAgo } from "@/lib/utils";
import type { Submission } from "@/types/submission.type";

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

	const footer =
		submission?.status === "PENDING" ? (
			<>
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
			</>
		) : null;

	return (
		<DetailSheet
			open={open}
			onOpenChange={onOpenChange}
			title="Work log"
			description="Hours logged against a task, and how they were reviewed"
			footer={footer}
		>
			{submission ? (
				<>
					<PersonLine
						name={submission.employee.user.name}
						avatar={submission.employee.user.avatar}
						subtitle={submission.employee.employeeCode}
						monoSubtitle
						isYou={isOwn}
						trailing={<StatusBadge status={submission.status} />}
					/>

					<DetailFigure
						value={`${submission.hoursWorked} h`}
						caption={`worked on ${formatDay(submission.workDate)}`}
					/>

					<DetailList>
						<DetailRow label="Task">{submission.task.title}</DetailRow>
						{submission.task.project ? (
							<DetailRow label="Project">{submission.task.project.name}</DetailRow>
						) : null}
						<DetailRow label="Submitted">
							<time dateTime={submission.createdAt} className="tabular-nums">
								{formatDateTime(submission.createdAt)}
							</time>
							<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">
								{timeAgo(submission.createdAt)}
							</span>
						</DetailRow>
						{submission.reviewedAt ? (
							<DetailRow label={submission.status === "REJECTED" ? "Rejected" : "Approved"}>
								<time dateTime={submission.reviewedAt} className="tabular-nums">
									{formatDateTime(submission.reviewedAt)}
								</time>
								{reviewerName ? (
									<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">by {reviewerName}</span>
								) : null}
							</DetailRow>
						) : null}
					</DetailList>

					<div className="space-y-2">
						<SectionHeading>What they did</SectionHeading>
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
				</>
			) : null}
		</DetailSheet>
	);
}
