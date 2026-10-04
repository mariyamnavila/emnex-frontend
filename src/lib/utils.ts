import { formatDistanceToNowStrict } from "date-fns";

export { cn } from "cn";

/**
 * First letter of the first two words, uppercased — e.g. "Demo Admin" → "DA".
 * Shared by every avatar fallback in the app.
 */
export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

/** "Jan 1, 2026" for date-only fields stored as UTC midnight (never shifts a day) */
export function formatDay(value: string | Date): string {
	return new Date(value).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		timeZone: "UTC",
	});
}

const pad = (value: number) => String(value).padStart(2, "0");

/** "2026-10" — the current month in the viewer's time zone (for <input type="month">) */
export function currentMonth(): string {
	const now = new Date();
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

/** "2026-10-04" — today in the viewer's time zone (for <input type="date">) */
export function today(): string {
	return `${currentMonth()}-${pad(new Date().getDate())}`;
}

/** "2026-03-01" from <input type="date"> → "2026-03-01T00:00:00.000Z" (date-only fields are UTC midnight) */
export function toIsoDay(day: string): string {
	return `${day}T00:00:00.000Z`;
}

/** "1 task", "3 tasks" (pass the plural for irregular words) */
export function plural(count: number, word: string, pluralWord = `${word}s`): string {
	return `${count} ${count === 1 ? word : pluralWord}`;
}

/** "Jan 2026" for payroll periods (UTC midnight, so January never shows as December) */
export function formatMonth(value: string | Date): string {
	return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

/** "Oct 4, 2026, 12:10 PM" (or with seconds) in the viewer's time zone */
export function formatDateTime(value: string | Date, { seconds = false } = {}): string {
	return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: seconds ? "medium" : "short" });
}

/** "3 days ago" */
export function timeAgo(value: string | Date): string {
	return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

/** Rounds to 2 decimals (cents, quarter hours) so float sums like 0.1 + 0.2 never leak into the UI */
export function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

/** Sum of one numeric field across a list, rounded to 2 decimals */
export function sumBy<T>(items: T[], pick: (item: T) => number): number {
	return round2(items.reduce((total, item) => total + pick(item), 0));
}

interface StatusTotal {
	status: string;
	_count: number;
	totalAmount?: number;
}

/** Count and amount across some statuses of an analytics `byStatus` list (all statuses when none given) */
export function sumByStatus(items: StatusTotal[] | undefined, statuses?: string[]) {
	const picked = (items ?? []).filter((item) => !statuses || statuses.includes(item.status));
	return {
		count: picked.reduce((sum, item) => sum + item._count, 0),
		amount: picked.reduce((sum, item) => sum + (item.totalAmount ?? 0), 0),
	};
}

/** "October 5, 2026" — shared date format for every table/sheet/detail view. */
export function formatDate(value: string | Date): string {
	return new Date(value).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/** "HR_MANAGER" → "HR Manager"; custom role names (not ALL_CAPS) are kept as typed */
export function formatRoleName(name: string): string {
	if (name !== name.toUpperCase()) return name;
	return name
		.split("_")
		.map((word) => (word.length <= 2 ? word : word.charAt(0) + word.slice(1).toLowerCase()))
		.join(" ");
}
