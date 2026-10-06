"use client";
import { focusNextOnEnter } from "@/lib/form";

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
import { useCreateProject, useUpdateProject } from "@/hooks/project.hook";
import type { Project } from "@/types/project.type";
import { PROJECT_STATUSES } from "./project-status-menu";
import { projectSchema, type ProjectFormValues } from "@/validation/project.validation";


const fieldClass =
	"border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

function FieldError({ message }: { message?: string }) {
	return message ? <p className="text-xs text-[#DC2626]">{message}</p> : null;
}

interface ProjectFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** null = create, otherwise edit this project */
	project: Project | null;
}

export function ProjectFormDialog({ open, onOpenChange, project }: ProjectFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-lg dark:border-[#1E293B] dark:bg-[#0F172A]">
				<ProjectForm project={project} onDone={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}

function ProjectForm({ project, onDone }: { project: Project | null; onDone: () => void }) {
	const isEdit = project !== null;
	const createProject = useCreateProject();
	const updateProject = useUpdateProject();
	const isSaving = createProject.isPending || updateProject.isPending;

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors, isDirty },
	} = useForm<ProjectFormValues>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			name: project?.name ?? "",
			description: project?.description ?? "",
			startDate: project?.startDate?.slice(0, 10) ?? "",
			endDate: project?.endDate?.slice(0, 10) ?? "",
			budget: project?.budget ? String(project.budget) : "",
			status: project?.status ?? "PLANNED",
		},
	});

	function onSubmit(values: ProjectFormValues) {
		if (project) {
			updateProject.mutate({ id: project.id, values }, { onSuccess: onDone });
		} else {
			createProject.mutate(values, { onSuccess: onDone });
		}
	}

	return (
		<form onKeyDown={focusNextOnEnter} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">
					{isEdit ? "Edit project" : "New project"}
				</DialogTitle>
				<DialogDescription>
					{isEdit
						? "Update details, timeline, budget or status."
						: "New projects start as Planned. Add tasks from the project page."}
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-1.5">
				<Label htmlFor="project-name" className="text-xs font-semibold">
					Name
				</Label>
				<Input
					id="project-name"
					placeholder="e.g. Website Redesign"
					autoFocus
					aria-invalid={Boolean(errors.name)}
					{...register("name")}
					className={`h-10 ${fieldClass}`}
				/>
				<FieldError message={errors.name?.message} />
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="project-description" className="text-xs font-semibold">
					Description <span className="font-normal text-[#94A3B8]">(optional)</span>
				</Label>
				<Textarea
					id="project-description"
					rows={3}
					placeholder="Goal and scope of the project"
					{...register("description")}
					className={`resize-none ${fieldClass}`}
				/>
				<FieldError message={errors.description?.message} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="project-start" className="text-xs font-semibold">
						Start date
					</Label>
					<Controller
						control={control}
						name="startDate"
						render={({ field }) => (
							<DatePicker
								id="project-start"
								value={field.value ?? ""}
								onChange={field.onChange}
								placeholder="Select start date"
							/>
						)}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="project-end" className="text-xs font-semibold">
						End date
					</Label>
					<Controller
						control={control}
						name="endDate"
						render={({ field }) => (
							<DatePicker
								id="project-end"
								value={field.value ?? ""}
								onChange={field.onChange}
								min={watch("startDate") || undefined}
								invalid={Boolean(errors.endDate)}
								placeholder="Select end date"
							/>
						)}
					/>
					<FieldError message={errors.endDate?.message} />
				</div>
			</div>

			<div className={isEdit ? "grid gap-4 sm:grid-cols-2" : undefined}>
				<div className="space-y-1.5">
					<Label htmlFor="project-budget" className="text-xs font-semibold">
						Budget <span className="font-normal text-[#94A3B8]">(optional)</span>
					</Label>
					<div className="relative">
						<span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#64748B]">
							$
						</span>
						<Input
							id="project-budget"
							type="number"
							inputMode="decimal"
							min="1"
							step="0.01"
							placeholder="50,000.00"
							aria-invalid={Boolean(errors.budget)}
							{...register("budget")}
							className={`h-10 pl-7 tabular-nums ${fieldClass}`}
						/>
					</div>
					<FieldError message={errors.budget?.message} />
				</div>

				{isEdit ? (
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold">Status</Label>
						<Controller
							control={control}
							name="status"
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className={`h-10 w-full ${fieldClass}`}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{PROJECT_STATUSES.map((status) => (
											<SelectItem key={status} value={status}>
												{formatStatus(status)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				) : null}
			</div>

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
					disabled={isSaving || (isEdit && !isDirty)}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
					{isEdit ? "Save changes" : "Create project"}
				</Button>
			</DialogFooter>
		</form>
	);
}
