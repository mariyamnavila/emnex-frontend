"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Keeps filters/search/pagination in the URL, e.g. ?page=2&search=ali
export const useUrlFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string, fallback = "") =>
    searchParams.get(key) ?? fallback;

  // Example: apply({ search: "ali" })  → resets to page 1
  const apply = (updates: Record<string, string | number | null>) => {
    const next = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }

    // Changing a filter always goes back to page 1
    if (!("page" in updates)) {
      next.delete("page");
    }

    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const setPage = (value: number) =>
    apply({ page: value <= 1 ? null : value });

  return { get, apply, setPage, page };
};
