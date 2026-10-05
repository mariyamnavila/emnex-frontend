"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useCopy } from "@/hooks/use-copy";

interface CredentialsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	email: string;
	temporaryPassword: string;
}

// Shows a one-time temporary password (new employee or resent credentials) with
// a copy button, so an admin can share it if the email doesn't arrive.
export function CredentialsDialog({ open, onOpenChange, title, description, email, temporaryPassword }: CredentialsDialogProps) {
	const { copy } = useCopy();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
				<DialogHeader>
					<DialogTitle className="text-[#0F172A] dark:text-white">{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<dl className="space-y-3 text-sm">
					<div className="space-y-1">
						<dt className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Email</dt>
						<dd className="font-medium text-[#0F172A] dark:text-white">{email}</dd>
					</div>
					<div className="space-y-1">
						<dt className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Temporary password</dt>
						<dd className="flex items-center gap-2">
							<code className="flex-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-mono text-sm text-[#0F172A] select-all dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white">
								{temporaryPassword}
							</code>
							<Button
								type="button"
								variant="outline"
								size="icon"
								aria-label="Copy temporary password"
								className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
								onClick={() => void copy(temporaryPassword, "Password copied")}
							>
								<Copy className="size-4" />
							</Button>
						</dd>
					</div>
				</dl>

				<DialogFooter>
					<Button
						type="button"
						className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
						onClick={() => onOpenChange(false)}
					>
						Done
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
