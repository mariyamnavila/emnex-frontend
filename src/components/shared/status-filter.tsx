"use client";

import { FilterSelect } from "./filter-select";
import { type FilterTab, FilterTabs } from "./filter-tabs";

interface StatusFilterProps {
	label: string;
	/** "" = all */
	value: string;
	onChange: (value: string | null) => void;
	/** First tab is the "all" tab (value "") */
	tabs: FilterTab[];
	/** Label of the "all" option in the dropdown */
	allLabel?: string;
}

const withCount = (label: string, count?: number) => (
	<>
		{label}
		{count === undefined ? null : <span className="text-[#94A3B8] tabular-nums"> · {count}</span>}
	</>
);

// Narrow cards get a dropdown (nothing hidden or scrolled away), wide ones a single row of tabs.
// Needs an `@container` ancestor.
export function StatusFilter({ label, value, onChange, tabs, allLabel = "All statuses" }: StatusFilterProps) {
	const [all, ...statuses] = tabs;
	return (
		<>
			<FilterSelect
				label={label}
				allLabel={withCount(allLabel, all?.count)}
				value={value}
				onChange={onChange}
				options={statuses.map((tab) => ({ value: tab.value, label: withCount(tab.label, tab.count) }))}
				className="@2xl:hidden"
			/>
			<FilterTabs
				label={label}
				value={value}
				onChange={(next) => onChange(next || null)}
				className="hidden flex-nowrap @2xl:inline-flex"
				tabs={tabs}
			/>
		</>
	);
}
