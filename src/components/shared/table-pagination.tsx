"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  isLoading?: boolean;
}

const JUMP = 5;

// 1 … 4 [5] 6 … 20 — first, last and the pages around the current one
function getPageItems(page: number, totalPages: number): (number | "jump-back" | "jump-ahead")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "jump-ahead", totalPages];
  if (page >= totalPages - 3) {
    return [1, "jump-back", ...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)];
  }
  return [1, "jump-back", page - 1, page, page + 1, "jump-ahead", totalPages];
}

const itemClass =
  "size-7 min-w-7 border-[#E2E8F0] px-0 text-xs font-medium text-[#334155] tabular-nums hover:bg-[#F8FAFC] sm:size-8 sm:min-w-8 dark:border-[#1E293B] dark:text-[#CBD5E1]";

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
  const pages = Math.max(totalPages, 1);
  const hasPrevious = page > 1;
  const hasNext = page < pages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
      {typeof total === "number" ? (
        <p className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
          Showing <span className="font-semibold text-[#0F172A] dark:text-white">{total}</span> result
          {total === 1 ? "" : "s"} · Page{" "}
          <span className="font-semibold text-[#0F172A] dark:text-white">{page}</span> of{" "}
          <span className="font-semibold text-[#0F172A] dark:text-white">{pages}</span>
        </p>
      ) : (
        <p className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
          Page <span className="font-semibold text-[#0F172A] dark:text-white">{page}</span> of{" "}
          <span className="font-semibold text-[#0F172A] dark:text-white">{pages}</span>
        </p>
      )}
      {pages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button
            variant="outline"
            disabled={!hasPrevious || isLoading}
            onClick={() => setPage(page - 1)}
            aria-label="Previous page"
            className={cn(itemClass, "sm:w-auto sm:px-3")}
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          {getPageItems(page, pages).map((item) => {
            if (item === "jump-back" || item === "jump-ahead") {
              const back = item === "jump-back";
              const target = back ? Math.max(1, page - JUMP) : Math.min(pages, page + JUMP);
              const Icon = back ? ChevronsLeft : ChevronsRight;
              return (
                <Button
                  key={item}
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => setPage(target)}
                  title={`Go to page ${target}`}
                  aria-label={`${back ? "Back" : "Ahead"} ${JUMP} pages, to page ${target}`}
                  className={cn(itemClass, "group/jump border-transparent text-[#94A3B8] dark:border-transparent")}
                >
                  <span className="group-hover/jump:hidden group-focus-visible/jump:hidden">…</span>
                  <Icon
                    className="hidden size-3.5 group-hover/jump:block group-focus-visible/jump:block"
                    aria-hidden="true"
                  />
                </Button>
              );
            }
            const current = item === page;
            return (
              <Button
                key={item}
                variant="outline"
                disabled={isLoading && !current}
                onClick={() => !current && setPage(item)}
                aria-current={current ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={cn(
                  itemClass,
                  current &&
                    "border-[#2563EB] bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white dark:border-[#2563EB] dark:text-white",
                )}
              >
                {item}
              </Button>
            );
          })}
          <Button
            variant="outline"
            disabled={!hasNext || isLoading}
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
            className={cn(itemClass, "sm:w-auto sm:px-3")}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
