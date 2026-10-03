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
