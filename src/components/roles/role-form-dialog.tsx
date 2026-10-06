"use client";
import { focusNextOnEnter } from "@/lib/form";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionGrid } from "@/components/roles/permission-editor";
import { useCreateRole, usePermissions, useUpdateRole } from "@/hooks/role.hook";
import { cn, plural } from "@/lib/utils";
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
	const isEdit = role !== null;
	// Create is a 2-step wizard: details → permissions. Edit stays single-step.
	const [step, setStep] = useState<1 | 2>(1);
	const [selected, setSelected] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (open) {
			setStep(1);
			setSelected(new Set());
		}
	}, [open]);

	const wide = !isEdit && step === 2;
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					"border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]",
					wide ? "sm:max-w-3xl" : "sm:max-w-md",
				)}
			>
				<RoleForm
					role={role}
					step={step}
					setStep={setStep}
					selected={selected}
					setSelected={setSelected}
					onDone={() => onOpenChange(false)}
					onCreated={onCreated}
				/>
			</DialogContent>
		</Dialog>
	);
}

function RoleForm({
	role,
	step,
	setStep,
	selected,
	setSelected,
	onDone,
	onCreated,
}: {
	role: Role | null;
	step: 1 | 2;
	setStep: (step: 1 | 2) => void;
	selected: Set<string>;
	setSelected: (next: Set<string>) => void;
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
		getValues,
		formState: { errors },
	} = useForm<RoleFormValues>({
		resolver: zodResolver(roleSchema),
		defaultValues: { name: role?.name ?? "", description: role?.description ?? "" },
	});
	const descriptionLength = useWatch({ control, name: "description" })?.length ?? 0;

	// Edit → save now. Create → carry the details to the permissions step.
	function onSubmitDetails(values: RoleFormValues) {
		if (role) {
			updateRole.mutate({ id: role.id, values }, { onSuccess: onDone });
		} else {
			setStep(2);
		}
	}

	function handleCreate() {
		if (selected.size === 0) return;
		createRole.mutate(
			{ ...getValues(), permissionIds: [...selected] },
			{
				onSuccess: ({ data }) => {
					onDone();
					onCreated?.(data);
				},
			},
		);
	}

	if (!isEdit && step === 2) {
		return (
			<PermissionStep
				selected={selected}
				setSelected={setSelected}
				onBack={() => setStep(1)}
				onCreate={handleCreate}
				isSaving={isSaving}
			/>
		);
	}

	return (
		<form onKeyDown={focusNextOnEnter} onSubmit={handleSubmit(onSubmitDetails)} className="space-y-5" noValidate>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">
					{isEdit ? "Edit role" : "New role"}
				</DialogTitle>
				<DialogDescription>
					{isEdit
						? "Rename the role or update its description."
						: "Name the role — next, choose exactly what it can do."}
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
					{isEdit ? "Save changes" : "Next"}
				</Button>
			</DialogFooter>
		</form>
	);
}

function PermissionStep({
	selected,
	setSelected,
	onBack,
	onCreate,
	isSaving,
}: {
	selected: Set<string>;
	setSelected: (next: Set<string>) => void;
	onBack: () => void;
	onCreate: () => void;
	isSaving: boolean;
}) {
	const catalog = usePermissions();

	return (
		<div className="space-y-5">
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">Choose permissions</DialogTitle>
				<DialogDescription>
					Pick what this role can do — ticking an action pulls in its View automatically.
				</DialogDescription>
			</DialogHeader>

			<div className="@container max-h-[60vh] overflow-y-auto pr-1 pb-1">
				{catalog.isLoading ? (
					<div className="grid gap-4 @2xl:grid-cols-2">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-40 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />
						))}
					</div>
				) : catalog.data ? (
					<PermissionGrid catalog={catalog.data} selected={selected} onChange={setSelected} />
				) : (
					<p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
						Couldn&apos;t load permissions. {catalog.error?.message}
					</p>
				)}
			</div>

			<DialogFooter className="items-center gap-2 sm:justify-between">
				<span
					className={cn(
						"mr-auto text-xs",
						selected.size === 0 ? "text-[#DC2626]" : "text-[#64748B] dark:text-[#94A3B8]",
					)}
				>
					{selected.size === 0
						? "Select at least one permission"
						: `${plural(selected.size, "permission")} selected`}
				</span>
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					disabled={isSaving}
					className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					Back
				</Button>
				<Button
					type="button"
					onClick={onCreate}
					disabled={isSaving || selected.size === 0}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
					Create role
				</Button>
			</DialogFooter>
		</div>
	);
}
