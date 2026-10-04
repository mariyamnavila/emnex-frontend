"use client";

import { useState } from "react";
import { toast } from "sonner";

// Clipboard copy with a short "copied" state for the icon
export function useCopy() {
	const [copied, setCopied] = useState(false);

	async function copy(value: string, successMessage?: string) {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
			if (successMessage) toast.success(successMessage);
		} catch {
			toast.error("Couldn't copy — select the text and copy it manually");
		}
	}

	return { copied, copy };
}
