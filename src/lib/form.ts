import type { KeyboardEvent } from "react";

// Enter in a text-like input moves focus to the next form control instead of
// submitting. Textareas keep their newline; the last control still submits.
// Attach to a <form>: onKeyDown={focusNextOnEnter}
export function focusNextOnEnter(event: KeyboardEvent<HTMLFormElement>) {
	if (event.key !== "Enter" || event.shiftKey) return;

	const target = event.target as HTMLElement;
	if (target.tagName !== "INPUT") return; // textarea → newline; buttons/selects → default
	const type = (target as HTMLInputElement).type;
	if (["submit", "button", "checkbox", "radio", "file"].includes(type)) return;

	const controls = Array.from(
		event.currentTarget.querySelectorAll<HTMLElement>('input, select, textarea, [role="combobox"]'),
	).filter((el) => {
		if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
		if ((el as HTMLInputElement).type === "hidden") return false;
		return el.offsetParent !== null; // visible
	});

	const index = controls.indexOf(target);
	if (index === -1 || index === controls.length - 1) return; // last field → let it submit

	event.preventDefault();
	const next = controls[index + 1];
	next.focus();
	if (next instanceof HTMLInputElement && /^(text|email|number|password|search|tel|url)$/.test(next.type)) {
		next.select();
	}
}
