"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  skeletonRows?: number;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  skeletonRows = 5,
  empty,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (!isLoading && rows.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]",
          className
        )}
      >
        {empty ?? <EmptyState title="No records found" description="Try adjusting your search or filters." />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]",
        className
      )}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A]">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "h-10 text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <TableRow
                    key={`skeleton-${rowIndex}`}
                    className="border-b border-[#F1F5F9] dark:border-[#1E293B]"
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key} className="py-3.5">
                        <Skeleton className="h-4 w-full bg-[#F1F5F9] dark:bg-[#1E293B]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row) => (
                  <TableRow
                    key={rowKey(row)}
                    className={cn(
                      "border-b border-[#F1F5F9] transition-colors hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:hover:bg-[#1E293B]/50",
                      onRowClick && "group cursor-pointer"
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn("py-3.5 text-sm text-[#334155] dark:text-[#CBD5E1]", column.className)}
                      >
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
