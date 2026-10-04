"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRejectSubmission } from "@/hooks/submission.hook";
import { formatDay } from "@/lib/utils";
import type { Submission } from "@/types/submission.type";
import {
	rejectSubmissionSchema,
	type RejectSubmissionValues,
} from "@/validation/submission.validation";

interface RejectSubmissionDialogProps {
	submission: Submission | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onRejected?: () => void;
}

export function RejectSubmissionDialog({
	submission,
	open,
	onOpenChange,
	onRejected,
}: RejectSubmissionDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]">
				{submission ? (
					<RejectForm
						key={submission.id}
						submission={submission}
						onDone={() => onOpenChange(false)}
						onRejected={() => {
							onOpenChange(false);
							onRejected?.();
						}}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

function RejectForm({
	submission,
	onDone,
	onRejected,
}: {
	submission: Submission;
	onDone: () => void;
	onRejected: () => void;
}) {
	const reject = useRejectSubmission();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<RejectSubmissionValues>({
		resolver: zodResolver(rejectSubmissionSchema),
		defaultValues: { reason: "" },
	});
	const reasonLength = useWatch({ control, name: "reason" })?.length ?? 0;

	return (
		<form
			onSubmit={handleSubmit(({ reason }) => reject.mutate({ submission, reason }, { onSuccess: onRejected }))}
			className="space-y-5"
			noValidate
		>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">Reject submission</DialogTitle>
				<DialogDescription>
					{submission.employee.user.name} logged {submission.hoursWorked} h on “{submission.task.title}” for{" "}
					{formatDay(new Date(submission.workDate))}. They&apos;ll see your reason.
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<Label htmlFor="reject-reason" className="text-xs font-semibold">
						Reason
					</Label>
					<span className="text-xs text-[#94A3B8] tabular-nums">{reasonLength}/500</span>
				</div>
				<Textarea
					id="reject-reason"
					rows={4}
					autoFocus
					placeholder="e.g. Hours look high for this task — please split them across the days you worked."
					aria-invalid={Boolean(errors.reason)}
					{...register("reason")}
					className="resize-none border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
				/>
				{errors.reason ? <p className="text-xs text-[#DC2626]">{errors.reason.message}</p> : null}
			</div>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={onDone}
					disabled={reject.isPending}
					className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					Cancel
				</Button>
				<Button type="submit" variant="destructive" disabled={reject.isPending}>
					{reject.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
					Reject submission
				</Button>
			</DialogFooter>
		</form>
	);
}
