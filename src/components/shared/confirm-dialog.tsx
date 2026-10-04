"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: ReactNode;
	description?: ReactNode;
	confirmLabel: string;
	/** Shown on the button while `isPending` */
	pendingLabel?: string;
	isPending?: boolean;
	/** "destructive" for deletes / terminations */
	tone?: "default" | "destructive";
	onConfirm: () => void;
}

// "Are you sure?" with Cancel + one action; the caller closes it when the action settles
export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel,
	pendingLabel,
	isPending = false,
	tone = "default",
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
				<DialogHeader>
					<DialogTitle className="text-[#0F172A] dark:text-white">{title}</DialogTitle>
					{description ? <DialogDescription>{description}</DialogDescription> : null}
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
						className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
					>
						Cancel
					</Button>
					<Button
						variant={tone === "destructive" ? "destructive" : "default"}
						disabled={isPending}
						onClick={onConfirm}
						className={tone === "destructive" ? undefined : "bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"}
					>
						{isPending ? <Loader2 className="size-4 animate-spin" /> : null}
						{isPending && pendingLabel ? pendingLabel : confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
