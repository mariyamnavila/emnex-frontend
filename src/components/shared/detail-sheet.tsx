"use client";

import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

interface DetailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: ReactNode;
	description?: ReactNode;
	/** Pinned to the bottom, e.g. Approve / Reject */
	footer?: ReactNode;
	children?: ReactNode;
}

// The right-side panel every "row → details" view opens
export function DetailSheet({ open, onOpenChange, title, description, footer, children }: DetailSheetProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				onOpenAutoFocus={(event) => event.preventDefault()}
				className="w-full gap-0 overflow-y-auto border-[#E2E8F0] bg-white outline-none sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]"
			>
				<SheetHeader className="border-b border-[#E2E8F0] pb-4 dark:border-[#1E293B]">
					<SheetTitle className="text-base text-[#0F172A] dark:text-white">{title}</SheetTitle>
					{description ? <SheetDescription className="text-xs">{description}</SheetDescription> : null}
				</SheetHeader>

				{children ? (
					<div className="flex flex-1 flex-col">
						<div className="flex-1 space-y-6 p-5">{children}</div>
						{footer ? (
							<div className="sticky bottom-0 border-t border-[#E2E8F0] bg-white p-4 dark:border-[#1E293B] dark:bg-[#0F172A]">
								{footer}
							</div>
						) : null}
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<h3 className={cn("text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]", className)}>
			{children}
		</h3>
	);
}

/** A divided list of DetailRows; `bordered` adds lines above and below */
export function DetailList({
	children,
	bordered = true,
	className,
}: {
	children: ReactNode;
	bordered?: boolean;
	className?: string;
}) {
	return (
		<dl
			className={cn(
				"divide-y divide-[#F1F5F9] dark:divide-[#1E293B]",
				bordered && "border-y border-[#F1F5F9] dark:border-[#1E293B]",
				className,
			)}
		>
			{children}
		</dl>
	);
}

interface PersonLineProps {
	name: string;
	avatar?: string | null;
	/** Second line, e.g. employee code or email */
	subtitle: ReactNode;
	monoSubtitle?: boolean;
	isYou?: boolean;
	/** Right side, usually a StatusBadge */
	trailing?: ReactNode;
}

/** Avatar + name + subtitle at the top of a panel */
export function PersonLine({ name, avatar, subtitle, monoSubtitle = false, isYou = false, trailing }: PersonLineProps) {
	return (
		<div className="flex items-center gap-3">
			<UserAvatar name={name} src={avatar} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium text-[#0F172A] dark:text-white">
					{name}
					{isYou ? <span className="ml-1.5 text-xs font-normal text-[#64748B]">(you)</span> : null}
				</p>
				<p className={cn("truncate text-xs text-[#64748B] dark:text-[#94A3B8]", monoSubtitle && "font-mono")}>
					{subtitle}
				</p>
			</div>
			{trailing}
		</div>
	);
}

/** The headline number of a panel, e.g. "6 h" or "$3,600.00" */
export function DetailFigure({ value, caption }: { value: ReactNode; caption: ReactNode }) {
	return (
		<div className="rounded-lg border border-[#E2E8F0] p-4 dark:border-[#1E293B]">
			<p className="text-3xl font-bold text-[#0F172A] tabular-nums dark:text-white">{value}</p>
			<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">{caption}</p>
		</div>
	);
}

interface DetailRowProps {
	label: ReactNode;
	children: ReactNode;
	/** "grid": label column + value; "split": label left, value right-aligned */
	variant?: "grid" | "split";
}

export function DetailRow({ label, children, variant = "grid" }: DetailRowProps) {
	if (variant === "split") {
		return (
			<div className="flex items-start justify-between gap-4 py-2.5">
				<dt className="text-sm text-[#64748B] dark:text-[#94A3B8]">{label}</dt>
				<dd className="min-w-0 text-right text-sm font-medium text-[#0F172A] dark:text-white">{children}</dd>
			</div>
		);
	}
	return (
		<div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 text-sm">
			<dt className="text-[#64748B] dark:text-[#94A3B8]">{label}</dt>
			<dd className="min-w-0 text-[#0F172A] dark:text-white">{children}</dd>
		</div>
	);
}
