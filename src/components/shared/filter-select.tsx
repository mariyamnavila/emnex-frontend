"use client";

import type { ReactNode } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEmployeeOptions } from "@/hooks/employee.hook";
import { cn } from "@/lib/utils";

const ALL = "__all__";

export const filterTriggerClass =
	"h-9 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white";

type Option = { value: string; label: ReactNode };

interface FilterSelectProps {
	label: string;
	/** "" = the "all" option */
	value: string;
	onChange: (value: string | null) => void;
	allLabel: ReactNode;
	options?: Option[];
	/** Labelled sections instead of a flat list */
	groups?: { label: ReactNode; options: Option[] }[];
	/** Width, e.g. "@xl:w-48" */
	className?: string;
}

// A toolbar dropdown whose "All …" option clears the filter
export function FilterSelect({ label, value, onChange, allLabel, options = [], groups = [], className }: FilterSelectProps) {
	return (
		<Select value={value || ALL} onValueChange={(next) => onChange(next === ALL ? null : next)}>
			<SelectTrigger aria-label={label} className={cn(filterTriggerClass, className)}>
				<SelectValue placeholder={allLabel} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL}>{allLabel}</SelectItem>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
				{groups.map((group, index) => (
					<SelectGroup key={`group-${index}`}>
						<SelectLabel>{group.label}</SelectLabel>
						{group.options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				))}
			</SelectContent>
		</Select>
	);
}

export function EmployeeFilter({
	value,
	onChange,
	className,
	label = "Filter by employee",
	allLabel = "All employees",
}: Pick<FilterSelectProps, "value" | "onChange" | "className"> & Partial<Pick<FilterSelectProps, "label" | "allLabel">>) {
	const { data: employees = [] } = useEmployeeOptions();
	return (
		<FilterSelect
			label={label}
			allLabel={allLabel}
			value={value}
			onChange={onChange}
			className={className}
			options={employees.map((employee) => ({ value: employee.id, label: employee.user.name }))}
		/>
	);
}
