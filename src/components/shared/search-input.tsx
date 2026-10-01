"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  param?: string;
  placeholder?: string;
  className?: string;
}

/**
 * Search box that syncs its (debounced) value to the URL — e.g. ?search=ali
 * Changing it resets pagination back to page 1.
 */
export function SearchInput({
  param = "search",
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  const { get, apply } = useUrlFilters();
  const urlValue = get(param);
  const [value, setValue] = useState(urlValue);
  const [lastUrlValue, setLastUrlValue] = useState(urlValue);
  const debounced = useDebounce(value, 350);

  // Sync input when the URL changes externally (back/forward navigation)
  if (urlValue !== lastUrlValue) {
    setLastUrlValue(urlValue);
    setValue(urlValue);
  }

  useEffect(() => {
    if (debounced !== urlValue) {
      apply({ [param]: debounced || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className={cn("relative w-full sm:w-64", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 border-[#CBD5E1] bg-white pl-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
      />
    </div>
  );
}
