"use client";
import { focusNextOnEnter } from "@/lib/form";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker, formatStatus } from "@/components/shared";
import { useActiveEmployees } from "@/hooks/employee.hook";
import { useProjectOptions } from "@/hooks/project.hook";
import { useCreateTask, useUpdateTask } from "@/hooks/task.hook";
import type { Task, TaskPriority } from "@/types/task.type";
import { taskSchema, type TaskFormValues } from "@/validation/task.validation";

const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const fieldClass =
	"border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

function FieldError({ message }: { message?: string }) {
	return message ? <p className="text-xs text-[#DC2626]">{message}</p> : null;
}

interface TaskFormDialogProps {
	/** Required to create a task; ignored when editing */
	projectId?: string;
	/** Pass a task to edit it; omit to create a new one */
	task?: Task | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TaskFormDialog({ projectId, task, open, onOpenChange }: TaskFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-lg dark:border-[#1E293B] dark:bg-[#0F172A]">
				{/* key: a fresh form per task (or for a new one) */}
				<TaskForm key={task?.id ?? "new"} projectId={projectId} task={task} onDone={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}

function TaskForm({
	projectId,
	task,
	onDone,
}: {
	projectId?: string;
	task?: Task | null;
	onDone: () => void;
}) {
	const isEdit = Boolean(task);
	// On the task board there's no fixed project, so the user picks one here.
	const needsProject = !isEdit && !projectId;
	const [projectForNew, setProjectForNew] = useState("");
	const createTask = useCreateTask(projectId ?? projectForNew);
	const updateTask = useUpdateTask(task?.id ?? "");
	const { data: employees = [], isLoading: employeesLoading } = useActiveEmployees();
	const { data: projects = [], isLoading: projectsLoading } = useProjectOptions();
	const mutation = isEdit ? updateTask : createTask;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isDirty },
	} = useForm<TaskFormValues>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: task?.title ?? "",
			description: task?.description ?? "",
			// Prefilled so validation passes; not sent when editing (reassign has its own action)
			employeeId: task?.employeeId ?? "",
			priority: task?.priority ?? "MEDIUM",
			estimatedHours: task?.estimatedHours != null ? String(task.estimatedHours) : "",
			dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
		},
	});

	return (
		<form onKeyDown={focusNextOnEnter}
			onSubmit={handleSubmit((values) => mutation.mutate(values, { onSuccess: onDone }))}
			className="space-y-5"
			noValidate
		>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">{isEdit ? "Edit task" : "New task"}</DialogTitle>
				<DialogDescription>
					{isEdit
						? "Update the task details. Use Reassign to change who's on it."
						: "Assign work to an active employee. They'll see it under My Tasks."}
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-1.5">
				<Label htmlFor="task-title" className="text-xs font-semibold">
					Title
				</Label>
				<Input
					id="task-title"
					placeholder="e.g. Build the pricing page"
					autoFocus
					aria-invalid={Boolean(errors.title)}
					{...register("title")}
					className={`h-10 ${fieldClass}`}
				/>
				<FieldError message={errors.title?.message} />
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="task-description" className="text-xs font-semibold">
					Description <span className="font-normal text-[#94A3B8]">(optional)</span>
				</Label>
				<Textarea
					id="task-description"
					rows={3}
					placeholder="What needs to be done?"
					{...register("description")}
					className={`resize-none ${fieldClass}`}
				/>
				<FieldError message={errors.description?.message} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				{needsProject ? (
					<div className="space-y-1.5 sm:col-span-2">
						<Label className="text-xs font-semibold">Project</Label>
						<Select value={projectForNew} onValueChange={setProjectForNew}>
							<SelectTrigger className={`h-10 w-full ${fieldClass}`}>
								<SelectValue placeholder={projectsLoading ? "Loading..." : "Choose a project"} />
							</SelectTrigger>
							<SelectContent>
								{projects.map((project) => (
									<SelectItem key={project.id} value={project.id}>
										{project.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				) : null}

				{!isEdit ? (
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold">Assignee</Label>
						<Controller
							control={control}
							name="employeeId"
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger
										aria-invalid={Boolean(errors.employeeId)}
										className={`h-10 w-full ${fieldClass}`}
									>
										<SelectValue
											placeholder={employeesLoading ? "Loading..." : "Choose an employee"}
										/>
									</SelectTrigger>
									<SelectContent>
										{employees.map((employee) => (
											<SelectItem key={employee.id} value={employee.id}>
												{employee.user.name}
												<span className="text-[#94A3B8]">· {employee.jobTitle}</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						<FieldError message={errors.employeeId?.message} />
					</div>
				) : null}

				<div className="space-y-1.5">
					<Label className="text-xs font-semibold">Priority</Label>
					<Controller
						control={control}
						name="priority"
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className={`h-10 w-full ${fieldClass}`}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PRIORITIES.map((priority) => (
										<SelectItem key={priority} value={priority}>
											{formatStatus(priority)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="task-hours" className="text-xs font-semibold">
						Estimated hours <span className="font-normal text-[#94A3B8]">(optional)</span>
					</Label>
					<Input
						id="task-hours"
						type="number"
						inputMode="decimal"
						min="0.5"
						step="0.5"
						placeholder="8"
						aria-invalid={Boolean(errors.estimatedHours)}
						{...register("estimatedHours")}
						className={`h-10 tabular-nums ${fieldClass}`}
					/>
					<FieldError message={errors.estimatedHours?.message} />
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="task-due" className="text-xs font-semibold">
						Due date <span className="font-normal text-[#94A3B8]">(optional)</span>
					</Label>
					<Controller
						control={control}
						name="dueDate"
						render={({ field }) => (
							<DatePicker
								id="task-due"
								value={field.value ?? ""}
								onChange={field.onChange}
								clearable
								placeholder="No due date"
							/>
						)}
					/>
				</div>
			</div>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={onDone}
					disabled={mutation.isPending}
					className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={mutation.isPending || (isEdit && !isDirty) || (needsProject && !projectForNew)}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
					{isEdit ? "Save changes" : "Create task"}
				</Button>
			</DialogFooter>
		</form>
	);
}
