"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ParamValue = string | number | null | undefined;

interface ApplyOptions {
  resetPage?: boolean;
}

/**
 * URL state synchronization for filters, search, sorting and pagination.
 * All list views must reflect their state in the URL (?page=2&search=...) so
 * views are bookmarkable and shareable.
 */
export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string, fallback = "") => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("search") ?? "";

  const apply = useCallback(
    (updates: Record<string, ParamValue>, options?: ApplyOptions) => {
      const resetPage = options?.resetPage ?? true;
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      if (resetPage && !("page" in updates)) {
        next.delete("page");
      }

      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setPage = useCallback(
    (value: number) => apply({ page: value <= 1 ? null : value }, { resetPage: false }),
    [apply],
  );

  return useMemo(
    () => ({ get, apply, setPage, page, search, searchParams }),
    [get, apply, setPage, page, search, searchParams],
  );
}
