"use client";

import { useMemo, useState } from "react";
import { Info, Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignPermissions, usePermissions, useRole } from "@/hooks/role.hook";
import { cn, plural } from "@/lib/utils";
import type { Permission } from "@/types/role.type";

// Display order + names for the "<module>.<action>" permission names
const MODULES: Record<string, string> = {
	organization: "Organization",
	employee: "Employees",
	department: "Departments",
	project: "Projects",
	task: "Tasks",
	submission: "Work submissions",
	payroll: "Payroll",
	payment: "Payments",
	role: "Roles",
	permission: "Permissions",
	audit: "Audit logs",
	analytics: "Analytics",
};

const actionLabel = (action: string) => {
	const text = action === "update" ? "edit" : action.replace(/_/g, " ");
	return text.charAt(0).toUpperCase() + text.slice(1);
};

function groupPermissions(permissions: Permission[]) {
	const groups = new Map<string, Permission[]>();
	for (const permission of permissions) {
		const area = permission.name.split(".")[0];
		groups.set(area, [...(groups.get(area) ?? []), permission]);
	}
	const order = Object.keys(MODULES);
	return [...groups.entries()]
		.sort(([a], [b]) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99))
		.map(([area, items]) => ({
			module: area,
			label: MODULES[area] ?? area.charAt(0).toUpperCase() + area.slice(1),
			items,
		}));
}

interface PermissionEditorProps {
	roleId: string;
	userCount: number;
	/** Own role or no permission.assign → view only */
	readOnlyReason: string | null;
}

export function PermissionEditor({ roleId, userCount, readOnlyReason }: PermissionEditorProps) {
	const role = useRole(roleId);
	const catalog = usePermissions();

	if (role.isLoading || catalog.isLoading) {
		return (
			<div className="grid gap-4 @2xl:grid-cols-2">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={`perm-${i}`} className="h-40 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />
				))}
			</div>
		);
	}

	if (!role.data || !catalog.data) {
		return (
			<p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
				Couldn&apos;t load this role&apos;s permissions. {role.error?.message ?? catalog.error?.message}
			</p>
		);
	}

	const saved = role.data.permissions.map((rp) => rp.permission.id).sort();
	// Remount (and reset edits) whenever the saved set changes, e.g. after saving
	return (
		<PermissionMatrix
			key={`${roleId}:${saved.join(",")}`}
			roleId={roleId}
			saved={saved}
			catalog={catalog.data}
			userCount={userCount}
			readOnlyReason={readOnlyReason}
		/>
	);
}

interface PermissionGridProps {
	catalog: Permission[];
	selected: Set<string>;
	onChange: (next: Set<string>) => void;
	readOnly?: boolean;
	/** Baseline to diff against for Added/Removed badges (edit mode only) */
	savedSet?: Set<string>;
}

// The permission checkbox matrix with the "action requires view" dependency
// rules. Controlled, so it's reused for both editing a role and creating one.
export function PermissionGrid({ catalog, selected, onChange, readOnly = false, savedSet }: PermissionGridProps) {
	// Acting on a resource requires viewing it: each "<module>.<action>" (not
	// view/view_own) depends on "<module>.view".
	const { requiredView, dependentsByView, viewIds } = useMemo(() => {
		const idByName = new Map(catalog.map((p) => [p.name, p.id]));
		const requiredView = new Map<string, string>();
		const dependentsByView = new Map<string, string[]>();
		const viewIds = new Set<string>();
		for (const permission of catalog) {
			const [moduleName, action] = permission.name.split(".");
			if (action === "view") viewIds.add(permission.id);
			if (action && action !== "view" && action !== "view_own") {
				const viewId = idByName.get(`${moduleName}.view`);
				if (viewId) {
					requiredView.set(permission.id, viewId);
					dependentsByView.set(viewId, [...(dependentsByView.get(viewId) ?? []), permission.id]);
				}
			}
		}
		return { requiredView, dependentsByView, viewIds };
	}, [catalog]);

	// A view can't be unchecked while an action in its module is still selected
	const isLockedView = (id: string) =>
		viewIds.has(id) && (dependentsByView.get(id) ?? []).some((dep) => selected.has(dep));

	const toggle = (ids: string[], on: boolean) => {
		const next = new Set(selected);
		for (const id of ids) {
			if (on) {
				next.add(id);
				const viewId = requiredView.get(id);
				if (viewId) next.add(viewId); // pull in the module's View
			} else {
				next.delete(id);
				for (const dep of dependentsByView.get(id) ?? []) next.delete(dep); // drop dependents
			}
		}
		onChange(next);
	};

	return (
		<div className="grid gap-4 @2xl:grid-cols-2">
			{groupPermissions(catalog).map((group) => {
				const ids = group.items.map((p) => p.id);
				const count = ids.filter((id) => selected.has(id)).length;
				const allOn = count === ids.length;
				return (
					<section
						key={group.module}
						className="rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
					>
						<header className="flex items-center justify-between gap-2 border-b border-[#F1F5F9] px-4 py-2.5 dark:border-[#1E293B]">
							<h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">
								{group.label}
								<span className="ml-2 text-xs font-medium text-[#94A3B8] tabular-nums">
									{count}/{ids.length}
								</span>
							</h3>
							{readOnly ? null : (
								<button
									type="button"
									onClick={() => toggle(ids, !allOn)}
									className="rounded px-1.5 py-0.5 text-xs font-medium text-[#2563EB] hover:bg-[#EFF6FF] focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none dark:text-[#60A5FA] dark:hover:bg-[#1E293B]"
								>
									{allOn ? "Clear" : "Select all"}
								</button>
							)}
						</header>
						<ul className="divide-y divide-[#F1F5F9] dark:divide-[#1E293B]">
							{group.items.map((permission) => {
								const checked = selected.has(permission.id);
								const changed = savedSet ? checked !== savedSet.has(permission.id) : false;
								const locked = isLockedView(permission.id);
								return (
									<li key={permission.id}>
										<label
											className={cn(
												"flex items-center gap-3 px-4 py-2.5",
												readOnly ? "cursor-default" : "cursor-pointer hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/40",
											)}
										>
											<Checkbox
												checked={checked}
												disabled={readOnly || locked}
												onCheckedChange={(value) => toggle([permission.id], value === true)}
												className="data-[state=checked]:border-[#2563EB] data-[state=checked]:bg-[#2563EB] data-[state=checked]:text-white"
											/>
											<span className="min-w-0 flex-1">
												<span className="block text-sm text-[#0F172A] dark:text-white">
													{actionLabel(permission.name.split(".").slice(1).join("."))}
												</span>
												<span className="block truncate font-mono text-[11px] text-[#94A3B8]">
													{permission.name}
												</span>
											</span>
											{locked ? (
												<span className="rounded-full bg-[#EFF6FF] px-1.5 py-px text-[10px] font-semibold text-[#2563EB] uppercase dark:bg-[#1E293B] dark:text-[#60A5FA]">
													Required
												</span>
											) : changed ? (
												<span
													className={cn(
														"rounded-full px-1.5 py-px text-[10px] font-semibold uppercase",
														checked
															? "bg-[#F0FDF4] text-[#16A34A]"
															: "bg-[#FEF2F2] text-[#DC2626]",
													)}
												>
													{checked ? "Added" : "Removed"}
												</span>
											) : null}
										</label>
									</li>
								);
							})}
						</ul>
					</section>
				);
			})}
		</div>
	);
}

interface PermissionMatrixProps {
	roleId: string;
	saved: string[];
	catalog: Permission[];
	userCount: number;
	readOnlyReason: string | null;
}

function PermissionMatrix({ roleId, saved, catalog, userCount, readOnlyReason }: PermissionMatrixProps) {
	const [selected, setSelected] = useState(() => new Set(saved));
	const assign = useAssignPermissions();
	const readOnly = readOnlyReason !== null;

	const savedSet = new Set(saved);
	const added = [...selected].filter((id) => !savedSet.has(id)).length;
	const removed = saved.filter((id) => !selected.has(id)).length;
	const changes = added + removed;

	return (
		<div className="space-y-4">
			{readOnly ? (
				<p className="flex items-start gap-2 rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] p-3 text-sm text-[#1E40AF] dark:border-[#1E3A5F] dark:bg-[#0B1120] dark:text-[#93C5FD]">
					<Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					{readOnlyReason}
				</p>
			) : null}

			<PermissionGrid
				catalog={catalog}
				selected={selected}
				onChange={setSelected}
				readOnly={readOnly}
				savedSet={savedSet}
			/>

			{changes > 0 ? (
				<div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:border-[#1E293B] dark:bg-[#0F172A]/95">
					<p className="text-sm text-[#334155] dark:text-[#CBD5E1]">
						<span className="font-semibold text-[#0F172A] dark:text-white">
							{plural(changes, "unsaved change")}
						</span>
						{selected.size === 0 ? (
							<span className="block text-xs text-[#DC2626]">A role needs at least one permission.</span>
						) : (
							<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">
								Applies to {plural(userCount, "user")} with this role immediately.
							</span>
						)}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							disabled={assign.isPending}
							onClick={() => setSelected(new Set(saved))}
							className="flex-1 border-[#E2E8F0] sm:flex-none"
						>
							<RotateCcw className="size-4" />
							Reset
						</Button>
						<Button
							disabled={assign.isPending || selected.size === 0}
							onClick={() => assign.mutate({ roleId, permissionIds: [...selected] })}
							className="flex-1 bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8] sm:flex-none"
						>
							{assign.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
							Save changes
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
}
