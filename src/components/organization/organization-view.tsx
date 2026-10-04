"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, FolderKanban, Loader2, Users, UserRound } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import {
	CopyButton,
	DetailList,
	DetailRow,
	fieldClass,
	FormField,
	PageHeader,
	StatCard,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCan } from "@/hooks/auth.hook";
import { useMyOrganization, useUpdateOrganization } from "@/hooks/organization.hook";
import { cn, formatDate } from "@/lib/utils";
import { organizationEditSchema, type OrganizationEditValues } from "@/validation/organization.validation";
import type { Organization } from "@/types/organization.type";

export function OrganizationView() {
	const { data: org, isLoading, isError } = useMyOrganization();
	const canUpdate = useCan()("organization.update");

	return (
		<div className="space-y-6">
			<PageHeader title="Organization" description="Your organization's details and size." />

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard title="Members" isLoading={isLoading} value={org?._count.users ?? 0} icon={Users} hint="User accounts" />
				<StatCard
					title="Employees"
					isLoading={isLoading}
					value={org?._count.employees ?? 0}
					icon={UserRound}
					hint="On the workforce"
				/>
				<StatCard
					title="Departments"
					isLoading={isLoading}
					value={org?._count.departments ?? 0}
					icon={Building2}
					hint="Teams"
				/>
				<StatCard
					title="Projects"
					isLoading={isLoading}
					value={org?._count.projects ?? 0}
					icon={FolderKanban}
					hint="All statuses"
				/>
			</div>

			<ChartCard title="Details" isLoading={isLoading} isError={isError}>
				{org ? (
					<DetailList bordered={false}>
						<DetailRow label="Name">{org.name}</DetailRow>
						<DetailRow label="Slug">
							<span className="flex items-center gap-2">
								<code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-xs text-[#334155] dark:bg-[#1E293B] dark:text-[#CBD5E1]">
									{org.slug}
								</code>
								<CopyButton value={org.slug} label="Copy slug" />
							</span>
						</DetailRow>
						<DetailRow label="Organization ID">
							<span className="flex items-center gap-2">
								<code className="font-mono text-xs break-all text-[#64748B] dark:text-[#94A3B8]">{org.id}</code>
								<CopyButton value={org.id} label="Copy ID" />
							</span>
						</DetailRow>
						<DetailRow label="Created">{formatDate(org.createdAt)}</DetailRow>
					</DetailList>
				) : null}
			</ChartCard>

			{canUpdate ? (
				<ChartCard title="Edit organization" description="Changing the name updates it everywhere." isLoading={isLoading} isError={isError}>
					{org ? <EditOrganizationForm key={org.id} org={org} /> : null}
				</ChartCard>
			) : null}
		</div>
	);
}

function EditOrganizationForm({ org }: { org: Organization }) {
	const update = useUpdateOrganization(org.id);
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<OrganizationEditValues>({
		resolver: zodResolver(organizationEditSchema),
		defaultValues: { name: org.name, slug: org.slug },
	});

	return (
		<form onSubmit={handleSubmit((values) => update.mutate(values))} className="grid max-w-xl gap-4" noValidate>
			<FormField id="org-name" label="Name" error={errors.name?.message}>
				<Input id="org-name" aria-invalid={Boolean(errors.name)} {...register("name")} className={cn("h-10", fieldClass)} />
			</FormField>
			<FormField id="org-slug" label="Slug" error={errors.slug?.message} hint="Lowercase letters, numbers and hyphens">
				<Input id="org-slug" aria-invalid={Boolean(errors.slug)} {...register("slug")} className={cn("h-10 font-mono", fieldClass)} />
			</FormField>
			<div>
				<Button
					type="submit"
					disabled={update.isPending || !isDirty}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{update.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
					Save changes
				</Button>
			</div>
		</form>
	);
}
