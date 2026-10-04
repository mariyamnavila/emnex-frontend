"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fieldClass } from "@/components/shared/form-field";
import { cn, formatDay } from "@/lib/utils";

interface DatePickerProps {
	/** "yyyy-MM-dd" (same string a native <input type="date"> gives), or "" */
	value: string;
	onChange: (value: string) => void;
	id?: string;
	placeholder?: string;
	/** "yyyy-MM-dd" bounds — days outside are not selectable */
	min?: string;
	max?: string;
	disabled?: boolean;
	invalid?: boolean;
	/** Show a Clear button in the popover (for optional dates) */
	clearable?: boolean;
	className?: string;
}

// "yyyy-MM-dd" → local Date (not UTC, so the calendar highlights the right day)
function parseDay(value: string): Date | undefined {
	if (!value) return undefined;
	const [year, month, day] = value.split("-").map(Number);
	if (!year || !month || !day) return undefined;
	return new Date(year, month - 1, day);
}

// local Date → "yyyy-MM-dd"
function toDay(date: Date): string {
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function DatePicker({
	value,
	onChange,
	id,
	placeholder = "Pick a date",
	min,
	max,
	disabled,
	invalid,
	clearable,
	className,
}: DatePickerProps) {
	const [open, setOpen] = useState(false);
	const selected = parseDay(value);
	const minDate = parseDay(min ?? "");
	const maxDate = parseDay(max ?? "");
	const disabledDays = [
		...(minDate ? [{ before: minDate }] : []),
		...(maxDate ? [{ after: maxDate }] : []),
	];

	return (
		<Popover open={open} onOpenChange={setOpen}>
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
						!selected && "text-[#94A3B8] dark:text-[#64748B]",
						className,
					)}
				>
					<CalendarIcon className="size-4 shrink-0 text-[#64748B] dark:text-[#94A3B8]" />
					{selected ? formatDay(value) : placeholder}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					captionLayout="dropdown"
					defaultMonth={selected ?? maxDate ?? new Date()}
					startMonth={minDate ?? new Date(2000, 0)}
					endMonth={maxDate ?? new Date(new Date().getFullYear() + 5, 11)}
					selected={selected}
					onSelect={(date) => {
						if (date) {
							onChange(toDay(date));
							setOpen(false);
						}
					}}
					disabled={disabledDays}
					autoFocus
				/>
				{clearable && selected ? (
					<div className="border-t border-[#E2E8F0] p-2 dark:border-[#1E293B]">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="w-full text-xs text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
							onClick={() => {
								onChange("");
								setOpen(false);
							}}
						>
							Clear
						</Button>
					</div>
				) : null}
			</PopoverContent>
		</Popover>
	);
}
