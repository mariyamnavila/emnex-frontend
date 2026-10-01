"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlFilters } from "@/hooks/use-url-filters";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  isLoading?: boolean;
}

/**
 * URL-driven pagination: always manipulates ?page= via useUrlFilters so the
 * current view stays bookmarkable.
 */
export function TablePagination({
  page,
  totalPages,
  total,
  isLoading = false,
}: TablePaginationProps) {
  const { setPage } = useUrlFilters();
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
      {typeof total === "number" ? (
        <p className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
          Showing <span className="font-semibold text-[#0F172A] dark:text-white">{total}</span> result
          {total === 1 ? "" : "s"} · Page{" "}
          <span className="font-semibold text-[#0F172A] dark:text-white">{page}</span> of{" "}
          <span className="font-semibold text-[#0F172A] dark:text-white">{Math.max(totalPages, 1)}</span>
        </p>
      ) : (
        <p className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
          Page <span className="font-semibold text-[#0F172A] dark:text-white">{page}</span> of{" "}
          <span className="font-semibold text-[#0F172A] dark:text-white">{Math.max(totalPages, 1)}</span>
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious || isLoading}
          onClick={() => setPage(page - 1)}
          className="h-8 border-[#E2E8F0] px-3 text-xs font-medium text-[#334155] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:text-[#CBD5E1]"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext || isLoading}
          onClick={() => setPage(page + 1)}
          className="h-8 border-[#E2E8F0] px-3 text-xs font-medium text-[#334155] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:text-[#CBD5E1]"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
