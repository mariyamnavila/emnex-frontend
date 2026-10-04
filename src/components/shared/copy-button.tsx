"use client";

import { Check, Copy } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
	value: string;
	label: string;
	className?: string;
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
	const { copied, copy } = useCopy();
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			onClick={() => copy(value)}
			className={cn(
				"shrink-0 rounded p-1 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#334155] dark:hover:bg-[#1E293B]",
				className,
			)}
		>
			{copied ? <Check className="size-3.5 text-[#16A34A]" /> : <Copy className="size-3.5" />}
		</button>
	);
}
