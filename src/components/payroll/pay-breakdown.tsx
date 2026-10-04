import { formatCurrency } from "@/lib/pay";
import { cn } from "@/lib/utils";

interface PayBreakdownProps {
	grossAmount: number;
	deductions: number;
	netAmount: number;
	className?: string;
}

// Gross − deductions = net, as one small statement
export function PayBreakdown({ grossAmount, deductions, netAmount, className }: PayBreakdownProps) {
	return (
		<dl className={cn("space-y-1.5 text-sm tabular-nums", className)}>
			<div className="flex justify-between">
				<dt className="text-[#64748B] dark:text-[#94A3B8]">Gross</dt>
				<dd className="text-[#0F172A] dark:text-white">{formatCurrency(grossAmount)}</dd>
			</div>
			<div className="flex justify-between">
				<dt className="text-[#64748B] dark:text-[#94A3B8]">Deductions</dt>
				<dd className="text-[#64748B] dark:text-[#94A3B8]">
					{deductions > 0 ? `− ${formatCurrency(deductions)}` : "—"}
				</dd>
			</div>
			<div className="flex justify-between border-t border-[#F1F5F9] pt-1.5 font-semibold dark:border-[#1E293B]">
				<dt className="text-[#0F172A] dark:text-white">Net pay</dt>
				<dd className="text-[#0F172A] dark:text-white">{formatCurrency(netAmount)}</dd>
			</div>
		</dl>
	);
}
