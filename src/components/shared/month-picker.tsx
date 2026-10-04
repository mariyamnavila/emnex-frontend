"use client";

import { useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fieldClass } from "@/components/shared/form-field";
import { cn, formatMonth } from "@/lib/utils";

interface MonthPickerProps {
	/** "YYYY-MM" (same string a native <input type="month"> gives), or "" */
	value: string;
	onChange: (value: string) => void;
	id?: string;
	placeholder?: string;
	/** "YYYY-MM" bounds — months outside are not selectable */
	min?: string;
	max?: string;
	disabled?: boolean;
	invalid?: boolean;
	className?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n: number) => String(n).padStart(2, "0");

export function MonthPicker({
	value,
	onChange,
	id,
	placeholder = "Pick a month",
	min,
	max,
	disabled,
	invalid,
	className,
}: MonthPickerProps) {
	const [open, setOpen] = useState(false);
	const [selectedYear, selectedMonth] = value ? value.split("-").map(Number) : [];
	const [viewYear, setViewYear] = useState(selectedYear ?? new Date().getFullYear());

	const isDisabled = (month: string) => (min && month < min) || (max && month > max);

	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				// Jump back to the selected year each time it opens
				if (next) setViewYear(selectedYear ?? new Date().getFullYear());
				setOpen(next);
			}}
		>
			<PopoverTrigger asChild>
				<Button
					id={id}
					type="button"
					variant="outline"
					disabled={disabled}
					aria-invalid={invalid}
					className={cn(
						"h-10 w-full justify-start gap-2 font-normal aria-invalid:border-[#DC2626] aria-invalid:ring-[#DC2626]",
						fieldClass,
						!value && "text-[#94A3B8] dark:text-[#64748B]",
						className,
					)}
				>
					<CalendarIcon className="size-4 shrink-0 text-[#64748B] dark:text-[#94A3B8]" />
					{value ? formatMonth(`${value}-01`) : placeholder}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-3" align="start">
				<div className="mb-2 flex items-center justify-between">
					<Button
						type="button"
						variant="outline"
						size="icon"
						aria-label="Previous year"
						onClick={() => setViewYear((year) => year - 1)}
						className="size-8 rounded-lg border-[#E2E8F0] text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] dark:border-[#1E293B] dark:hover:bg-[#1E293B] dark:hover:text-[#60A5FA]"
					>
						<ChevronLeft className="size-4" />
					</Button>
					<span className="text-sm font-semibold text-[#0F172A] dark:text-white">{viewYear}</span>
					<Button
						type="button"
						variant="outline"
						size="icon"
						aria-label="Next year"
						onClick={() => setViewYear((year) => year + 1)}
						className="size-8 rounded-lg border-[#E2E8F0] text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] dark:border-[#1E293B] dark:hover:bg-[#1E293B] dark:hover:text-[#60A5FA]"
					>
						<ChevronRight className="size-4" />
					</Button>
				</div>
				<div className="grid grid-cols-3 gap-1.5">
					{MONTHS.map((label, index) => {
						const month = `${viewYear}-${pad(index + 1)}`;
						const isSelected = selectedYear === viewYear && selectedMonth === index + 1;
						const off = isDisabled(month);
						return (
							<Button
								key={label}
								type="button"
								variant="ghost"
								disabled={Boolean(off)}
								onClick={() => {
									onChange(month);
									setOpen(false);
								}}
								className={cn(
									"h-9 rounded-lg text-sm font-normal text-[#334155] hover:bg-[#EFF6FF] hover:text-[#2563EB] disabled:opacity-40 dark:text-[#CBD5E1] dark:hover:bg-[#1E293B] dark:hover:text-[#60A5FA]",
									isSelected &&
										"bg-[#2563EB] font-semibold text-white hover:bg-[#1D4ED8] hover:text-white dark:bg-[#2563EB] dark:text-white",
								)}
							>
								{label}
							</Button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
