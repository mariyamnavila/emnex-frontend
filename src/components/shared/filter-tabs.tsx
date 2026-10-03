import { cn } from "@/lib/utils";

export interface FilterTab {
  /** "" = the "All" tab */
  value: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

// Segmented filter that wraps onto more lines instead of scrolling, so every
// option (and the active one) stays fully visible on small screens.
export function FilterTabs({ tabs, value, onChange, label, className }: FilterTabsProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1 dark:border-[#1E293B] dark:bg-[#0B1120]",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none",
              isActive
                ? "bg-white font-semibold text-[#2563EB] shadow-xs ring-1 ring-[#DBEAFE] dark:bg-[#1E293B] dark:text-[#60A5FA] dark:ring-[#1E3A5F]"
                : "font-medium text-[#64748B] hover:bg-white/70 hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:bg-[#1E293B]/60 dark:hover:text-white"
            )}
          >
            {tab.label}
            {tab.count !== undefined ? (
              <span
                className={cn(
                  "tabular-nums",
                  isActive ? "text-[#2563EB]/70 dark:text-[#60A5FA]/70" : "text-[#94A3B8]"
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
