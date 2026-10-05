"use client";
import { focusNextOnEnter } from "@/lib/form";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDepartment, useUpdateDepartment } from "@/hooks/department.hook";
import type { Department } from "@/types/employee.type";
import {
	departmentSchema,
	type DepartmentFormValues,
} from "@/validation/department.validation";

const fieldClass =
	"border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

interface DepartmentFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** null = create, otherwise edit this department */
	department: Department | null;
}

export function DepartmentFormDialog({
	open,
	onOpenChange,
	department,
}: DepartmentFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]">
				<DepartmentForm department={department} onDone={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}

function DepartmentForm({
	department,
	onDone,
}: {
	department: Department | null;
	onDone: () => void;
}) {
	const isEdit = department !== null;
	const createDepartment = useCreateDepartment();
	const updateDepartment = useUpdateDepartment();
	const isSaving = createDepartment.isPending || updateDepartment.isPending;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<DepartmentFormValues>({
		resolver: zodResolver(departmentSchema),
		defaultValues: {
			name: department?.name ?? "",
			description: department?.description ?? "",
		},
	});

	const descriptionLength = useWatch({ control, name: "description" })?.length ?? 0;

	function onSubmit(values: DepartmentFormValues) {
		if (department) {
			updateDepartment.mutate({ id: department.id, values }, { onSuccess: onDone });
		} else {
			createDepartment.mutate(values, { onSuccess: onDone });
		}
	}

	return (
		<form onKeyDown={focusNextOnEnter} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">
					{isEdit ? "Edit department" : "New department"}
				</DialogTitle>
				<DialogDescription>
					{isEdit
						? "Rename it or update what the team does."
						: "Group employees into a team you can filter and report on."}
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-1.5">
				<Label htmlFor="department-name" className="text-xs font-semibold">
					Name
				</Label>
				<Input
					id="department-name"
					placeholder="e.g. Engineering"
					autoFocus
					aria-invalid={Boolean(errors.name)}
					{...register("name")}
					className={`h-10 ${fieldClass}`}
				/>
				{errors.name ? (
					<p className="text-xs text-[#DC2626]">{errors.name.message}</p>
				) : null}
			</div>

			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<Label htmlFor="department-description" className="text-xs font-semibold">
						Description <span className="font-normal text-[#94A3B8]">(optional)</span>
					</Label>
					<span className="text-xs text-[#94A3B8] tabular-nums">
						{descriptionLength}/500
					</span>
				</div>
				<Textarea
					id="department-description"
					rows={3}
					placeholder="What does this team work on?"
					aria-invalid={Boolean(errors.description)}
					{...register("description")}
					className={`resize-none ${fieldClass}`}
				/>
				{errors.description ? (
					<p className="text-xs text-[#DC2626]">{errors.description.message}</p>
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
					disabled={isSaving}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
					{isEdit ? "Save changes" : "Create department"}
				</Button>
			</DialogFooter>
		</form>
	);
}
