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
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9"
      />
    </div>
  );
}
