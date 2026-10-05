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
import { useCreateRole, useUpdateRole } from "@/hooks/role.hook";
import type { Role } from "@/types/role.type";
import { roleSchema, type RoleFormValues } from "@/validation/role.validation";

const fieldClass =
	"border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

interface RoleFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** null = create, otherwise rename/describe this custom role */
	role: Role | null;
	onCreated?: (role: Role) => void;
}

export function RoleFormDialog({ open, onOpenChange, role, onCreated }: RoleFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]">
				<RoleForm role={role} onDone={() => onOpenChange(false)} onCreated={onCreated} />
			</DialogContent>
		</Dialog>
	);
}

function RoleForm({
	role,
	onDone,
	onCreated,
}: {
	role: Role | null;
	onDone: () => void;
	onCreated?: (role: Role) => void;
}) {
	const isEdit = role !== null;
	const createRole = useCreateRole();
	const updateRole = useUpdateRole();
	const isSaving = createRole.isPending || updateRole.isPending;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<RoleFormValues>({
		resolver: zodResolver(roleSchema),
		defaultValues: { name: role?.name ?? "", description: role?.description ?? "" },
	});
	const descriptionLength = useWatch({ control, name: "description" })?.length ?? 0;

	function onSubmit(values: RoleFormValues) {
		if (role) {
			updateRole.mutate({ id: role.id, values }, { onSuccess: onDone });
		} else {
			createRole.mutate(values, {
				onSuccess: ({ data }) => {
					onDone();
					onCreated?.(data);
				},
			});
		}
	}

	return (
		<form onKeyDown={focusNextOnEnter} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">
					{isEdit ? "Edit role" : "New role"}
				</DialogTitle>
				<DialogDescription>
					{isEdit
						? "Rename the role or update its description."
						: "Create a custom role, then choose exactly what it can do."}
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-1.5">
				<Label htmlFor="role-name" className="text-xs font-semibold">
					Name
				</Label>
				<Input
					id="role-name"
					placeholder="e.g. Team Lead"
					autoFocus
					aria-invalid={Boolean(errors.name)}
					{...register("name")}
					className={`h-10 ${fieldClass}`}
				/>
				{errors.name ? <p className="text-xs text-[#DC2626]">{errors.name.message}</p> : null}
			</div>

			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<Label htmlFor="role-description" className="text-xs font-semibold">
						Description <span className="font-normal text-[#94A3B8]">(optional)</span>
					</Label>
					<span className="text-xs text-[#94A3B8] tabular-nums">{descriptionLength}/200</span>
				</div>
				<Textarea
					id="role-description"
					rows={3}
					placeholder="What is this role responsible for?"
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
				<Button type="submit" disabled={isSaving} className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]">
					{isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
					{isEdit ? "Save changes" : "Create role"}
				</Button>
			</DialogFooter>
		</form>
	);
}
