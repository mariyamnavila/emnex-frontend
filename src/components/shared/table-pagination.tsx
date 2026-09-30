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
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      {typeof total === "number" ? (
        <p className="text-sm text-muted-foreground">
          {total} result{total === 1 ? "" : "s"} · Page {page} of {Math.max(totalPages, 1)}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Page {page} of {Math.max(totalPages, 1)}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious || isLoading}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext || isLoading}
          onClick={() => setPage(page + 1)}
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
