"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { DatePicker, fieldClass, FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLogHours, useUpdateWorkLog } from "@/hooks/submission.hook";
import { today } from "@/lib/utils";
import type { MyTask } from "@/types/task.type";
import { logHoursSchema, type LogHoursValues } from "@/validation/submission.validation";

interface LogHoursDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Tasks hours can be logged against */
	tasks: MyTask[];
	/** Starting values, e.g. the task of the card it was opened from, or a rejected log to send again */
	initial?: Partial<LogHoursValues>;
	/** Edit this pending log instead of creating one (its task can't change) */
	editing?: { id: string; taskTitle: string } | null;
	/** Hours already logged per task (approved + pending), for the hint */
	loggedHours?: Record<string, number>;
}

export function LogHoursDialog({
	open,
	onOpenChange,
	tasks,
	initial,
	editing = null,
	loggedHours = {},
}: LogHoursDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-lg dark:border-[#1E293B] dark:bg-[#0F172A]">
				{open ? (
					<LogHoursForm
						tasks={tasks}
						initial={initial}
						editing={editing}
						loggedHours={loggedHours}
						onDone={() => onOpenChange(false)}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

function LogHoursForm({
	tasks,
	initial,
	editing,
	loggedHours,
	onDone,
}: {
	tasks: MyTask[];
	initial?: Partial<LogHoursValues>;
	editing: { id: string; taskTitle: string } | null;
	loggedHours: Record<string, number>;
	onDone: () => void;
}) {
	const logHours = useLogHours();
	const updateLog = useUpdateWorkLog();
	const isSaving = logHours.isPending || updateLog.isPending;
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<LogHoursValues>({
		resolver: zodResolver(logHoursSchema),
		defaultValues: { taskId: "", workDate: today(), hoursWorked: "", description: "", ...initial },
	});
	const [selectedId, description] = useWatch({ control, name: ["taskId", "description"] });
	const selected = tasks.find((task) => task.id === selectedId);
	const logged = selected ? (loggedHours[selected.id] ?? 0) : 0;

	return (
		<form
			onSubmit={handleSubmit((values) =>
				editing
					? updateLog.mutate({ id: editing.id, values }, { onSuccess: onDone })
					: logHours.mutate(values, { onSuccess: onDone }),
			)}
			className="space-y-5"
			noValidate
		>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">{editing ? "Edit work log" : "Log hours"}</DialogTitle>
				<DialogDescription>
					{editing
						? "You can change it until your manager reviews it."
						: "Your manager reviews each log. Approved hours count toward hourly pay."}
				</DialogDescription>
			</DialogHeader>

			<FormField
				id="log-task"
				label="Task"
				error={errors.taskId?.message}
				hint={
					selected
						? `${selected.project.name} · ${logged} h logged so far${selected.estimatedHours ? ` of ${selected.estimatedHours} h estimated` : ""}`
						: undefined
				}
			>
				{editing ? (
					<Input id="log-task" value={editing.taskTitle} disabled className={`h-10 ${fieldClass}`} />
				) : (
					<Controller
						control={control}
						name="taskId"
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger
									id="log-task"
									aria-invalid={Boolean(errors.taskId)}
									className={`h-10 w-full ${fieldClass}`}
								>
									<SelectValue placeholder={tasks.length ? "Choose a task" : "No tasks to log against"} />
								</SelectTrigger>
								<SelectContent>
									{tasks.map((task) => (
										<SelectItem key={task.id} value={task.id}>
											{task.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				)}
			</FormField>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField id="log-date" label="Day worked" error={errors.workDate?.message}>
					<Controller
						control={control}
						name="workDate"
						render={({ field }) => (
							<DatePicker
								id="log-date"
								value={field.value ?? ""}
								onChange={field.onChange}
								max={today()}
								invalid={Boolean(errors.workDate)}
								placeholder="Select the day"
							/>
						)}
					/>
				</FormField>
				<FormField id="log-hours" label="Hours" error={errors.hoursWorked?.message} hint="Up to 24, e.g. 1.5">
					<Input
						id="log-hours"
						type="number"
						inputMode="decimal"
						min={0.25}
						max={24}
						step={0.25}
						placeholder="0"
						aria-invalid={Boolean(errors.hoursWorked)}
						{...register("hoursWorked")}
						className={`h-10 tabular-nums ${fieldClass}`}
					/>
				</FormField>
			</div>

			<FormField
				id="log-description"
				label="What did you do?"
				counter={`${description?.length ?? 0}/5000`}
				error={errors.description?.message}
			>
				<Textarea
					id="log-description"
					rows={4}
					placeholder="e.g. Built the mobile menu and fixed the header layout on small screens."
					aria-invalid={Boolean(errors.description)}
					{...register("description")}
					className={`resize-none ${fieldClass}`}
				/>
			</FormField>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={onDone}
					disabled={isSaving}
					className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isSaving || (!editing && tasks.length === 0)}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
					{editing ? "Save changes" : "Log hours"}
				</Button>
			</DialogFooter>
		</form>
	);
}
