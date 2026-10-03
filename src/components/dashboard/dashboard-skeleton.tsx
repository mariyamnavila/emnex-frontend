import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const darkBone = "bg-white/7";
const bone = "bg-[#E2E8F0]/70 dark:bg-[#1E293B]";

// Same shape as the real dashboard, so nothing jumps when it arrives
export function DashboardSkeleton() {
	return (
		<div className="flex min-h-svh w-full bg-[#F8FAFC]" aria-busy="true" aria-label="Loading dashboard">
			<aside className="hidden w-64 shrink-0 flex-col bg-[#0F172A] md:flex">
				<div className="flex h-14 items-center gap-2.5 border-b border-white/6 px-4">
					<span className="flex size-8 items-center justify-center rounded-md bg-white/6 ring-1 ring-white/10">
						<Image src="/logo.png" alt="" width={20} height={20} className="size-5 object-contain" />
					</span>
					<div className="space-y-1.5">
						<p className="text-[15px] leading-none font-bold tracking-tight text-white">
							Em<span className="text-[#3B82F6]">Nex</span>
						</p>
						<Skeleton className={`h-2.5 w-20 ${darkBone}`} />
					</div>
				</div>
				<div className="flex-1 space-y-6 px-3 py-5">
					{[3, 4, 2].map((count, group) => (
						<div key={`group-${group}`} className="space-y-2">
							<Skeleton className={`mx-2 h-2.5 w-16 ${darkBone}`} />
							{Array.from({ length: count }).map((_, i) => (
								<Skeleton key={`item-${group}-${i}`} className={`h-9 rounded-md ${darkBone}`} />
							))}
						</div>
					))}
				</div>
				<div className="p-3">
					<Skeleton className={`h-12 rounded-lg ${darkBone}`} />
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex h-14 items-center gap-3 border-b border-[#E2E8F0] bg-white pr-4 pl-3 md:pr-6">
					<Skeleton className={`size-8 rounded-md ${bone}`} />
					<Skeleton className={`h-3.5 w-40 ${bone}`} />
				</div>
				<div className="mx-auto w-full max-w-350 space-y-6 p-4 md:p-6 lg:p-8">
					<div className="space-y-2">
						<Skeleton className={`h-7 w-48 ${bone}`} />
						<Skeleton className={`h-4 w-80 ${bone}`} />
					</div>
					<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={`card-${i}`} className={`h-32 rounded-lg ${bone}`} />
						))}
					</div>
					<Skeleton className={`h-80 rounded-lg ${bone}`} />
				</div>
			</div>
		</div>
	);
}
