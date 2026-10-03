import type { ReactNode } from "react";
import { AlertCircle, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
	title: string;
	description?: string;
	isLoading?: boolean;
	isError?: boolean;
	isEmpty?: boolean;
	emptyText?: string;
	className?: string;
	/** Shown at the right of the header, e.g. a "View all" link */
	action?: ReactNode;
	children: ReactNode;
}

export function ChartCard({
	title,
	description,
	isLoading = false,
	isError = false,
	isEmpty = false,
	emptyText = "No data yet.",
	className,
	action,
	children,
}: ChartCardProps) {
	let body = children;
	if (isLoading) {
		body = <Skeleton className="h-64 w-full bg-[#F1F5F9] dark:bg-[#1E293B]" />;
	} else if (isError || isEmpty) {
		const Icon = isError ? AlertCircle : BarChart3;
		body = (
			<div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
				<Icon
					className={cn("size-6", isError ? "text-[#DC2626]" : "text-[#94A3B8]")}
					aria-hidden="true"
				/>
				<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
					{isError ? "Couldn't load this data." : emptyText}
				</p>
			</div>
		);
	}

	return (
		<section
			className={cn(
				"flex flex-col rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]",
				className,
			)}
		>
			<header className="mb-4 flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">{title}</h2>
					{description ? (
						<p className="mt-0.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
							{description}
						</p>
					) : null}
				</div>
				{action ? <div className="shrink-0">{action}</div> : null}
			</header>
			<div className="flex-1">{body}</div>
		</section>
	);
}
