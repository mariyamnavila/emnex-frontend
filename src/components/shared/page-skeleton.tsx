import { Skeleton } from "@/components/ui/skeleton";

export const skeletonBone = "bg-[#F1F5F9] dark:bg-[#1E293B]";

interface PageSkeletonProps {
	/** Row of 4 stat cards */
	stats?: boolean;
	/** Filter/search bar above the content */
	toolbar?: boolean;
	/** A grid of cards instead of one table block */
	cards?: boolean;
}

// Suspense fallback shaped like a dashboard page (header + content), so nothing jumps on load
export function PageSkeleton({ stats = false, toolbar = false, cards = false }: PageSkeletonProps) {
	return (
		<div className="space-y-6" aria-busy="true">
			<div className="space-y-2 border-b border-[#E2E8F0] pb-5 dark:border-[#1E293B]">
				<Skeleton className={`h-8 w-40 ${skeletonBone}`} />
				<Skeleton className={`h-4 w-80 max-w-full ${skeletonBone}`} />
			</div>
			{stats ? (
				<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={`stat-${i}`} className={`h-32 rounded-lg ${skeletonBone}`} />
					))}
				</div>
			) : null}
			{toolbar ? <Skeleton className={`h-16 rounded-lg ${skeletonBone}`} /> : null}
			{cards ? (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={`card-${i}`} className={`h-40 rounded-lg ${skeletonBone}`} />
					))}
				</div>
			) : (
				<Skeleton className={`h-96 rounded-lg ${skeletonBone}`} />
			)}
		</div>
	);
}
