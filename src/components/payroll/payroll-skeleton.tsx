import { Skeleton } from "@/components/ui/skeleton";

const bone = "bg-[#F1F5F9] dark:bg-[#1E293B]";

export function PayrollSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2 border-b border-[#E2E8F0] pb-5 dark:border-[#1E293B]">
				<Skeleton className={`h-8 w-32 ${bone}`} />
				<Skeleton className={`h-4 w-80 max-w-full ${bone}`} />
			</div>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={`card-${i}`} className={`h-32 rounded-lg ${bone}`} />
				))}
			</div>
			<Skeleton className={`h-96 rounded-lg ${bone}`} />
		</div>
	);
}
