import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

/** Brand look for Input / Textarea / SelectTrigger inside forms */
export const fieldClass =
	"border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

export function FieldError({ message }: { message?: unknown }) {
	if (typeof message !== "string" || !message) return null;
	return <p className="text-xs text-[#DC2626]">{message}</p>;
}

interface FormFieldProps {
	id: string;
	label: ReactNode;
	optional?: boolean;
	/** Right of the label, e.g. "42/500" */
	counter?: ReactNode;
	/** Under the control when there's no error */
	hint?: ReactNode;
	error?: unknown;
	children: ReactNode;
}

// Label + control + hint/error, the layout every dialog form uses
export function FormField({ id, label, optional = false, counter, hint, error, children }: FormFieldProps) {
	const hasError = typeof error === "string" && error !== "";
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between gap-3">
				<Label htmlFor={id} className="text-xs font-semibold">
					{label}
					{optional ? <span className="font-normal text-[#94A3B8]"> (optional)</span> : null}
				</Label>
				{counter ? <span className="text-xs text-[#94A3B8] tabular-nums">{counter}</span> : null}
			</div>
			{children}
			{hasError ? (
				<FieldError message={error} />
			) : hint ? (
				<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{hint}</p>
			) : null}
		</div>
	);
}
