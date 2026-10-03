import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-[#E2E8F0] pb-5 dark:border-[#1E293B]">
        <Skeleton className="h-7 w-48 bg-[#F1F5F9] dark:bg-[#1E293B]" />
        <Skeleton className="h-4 w-72 bg-[#F1F5F9] dark:bg-[#1E293B]" />
      </div>

      {/* Metric Cards Skeleton Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 bg-[#F1F5F9] dark:bg-[#1E293B]" />
              <Skeleton className="size-8 rounded-md bg-[#EFF6FF] dark:bg-[#1E293B]" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-8 w-20 bg-[#F1F5F9] dark:bg-[#1E293B]" />
              <Skeleton className="h-3 w-32 bg-[#F1F5F9] dark:bg-[#1E293B]" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Skeleton */}
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-36 bg-[#F1F5F9] dark:bg-[#1E293B]" />
          <Skeleton className="h-9 w-48 rounded-md bg-[#F1F5F9] dark:bg-[#1E293B]" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-[#F1F5F9] dark:bg-[#1E293B]" />
          ))}
        </div>
      </div>
    </div>
  );
}
