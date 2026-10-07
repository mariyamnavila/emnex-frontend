import { cn } from "@/lib/utils";

export interface PlanRow {
	label: string;
	starter: string;
	pro: string;
	enterprise: string;
}

const PLANS = [
	{ key: "starter", label: "Starter" },
	{ key: "pro", label: "Pro" },
	{ key: "enterprise", label: "Enterprise" },
] as const;

// Phone layout for the plan comparison tables: one card per feature, plans side by side
export function PlanCards({ rows, className }: { rows: PlanRow[]; className?: string }) {
	return (
		<ul className={cn("divide-y divide-[#E2E8F0] dark:divide-[#1E293B]", className)}>
			{rows.map((row) => (
				<li key={row.label} className="px-4 py-3.5">
					<p className="text-xs font-semibold text-[#0F172A] dark:text-white">{row.label}</p>
					<dl className="mt-2 grid grid-cols-3 gap-3 text-[11px]">
						{PLANS.map(({ key, label }) => (
							<div key={key} className="min-w-0">
								<dt
									className={cn(
										"font-semibold tracking-wide uppercase",
										key === "pro" ? "text-[#2563EB]" : "text-[#94A3B8]",
									)}
								>
									{label}
								</dt>
								<dd
									className={cn(
										"mt-0.5 break-words",
										key === "pro" ? "font-semibold text-[#2563EB]" : "text-[#334155] dark:text-[#CBD5E1]",
									)}
								>
									{row[key]}
								</dd>
							</div>
						))}
					</dl>
				</li>
			))}
		</ul>
	);
}
