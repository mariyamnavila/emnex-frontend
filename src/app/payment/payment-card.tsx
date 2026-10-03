import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
	success: "bg-[#F0FDF4] text-[#16A34A] dark:bg-[#16A34A]/10",
	warning: "bg-[#FFFBEB] text-[#D97706] dark:bg-[#D97706]/10",
	error: "bg-[#FEF2F2] text-[#DC2626] dark:bg-[#DC2626]/10",
	info: "bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B]",
} as const;

interface PaymentCardProps {
	icon: LucideIcon;
	tone: keyof typeof TONES;
	title: string;
	description: React.ReactNode;
	spin?: boolean;
	children?: React.ReactNode;
}

export function PaymentCard({ icon: Icon, tone, title, description, spin, children }: PaymentCardProps) {
	return (
		<section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs sm:p-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
			<div className="flex flex-col items-center text-center">
				<div className={cn("flex size-12 items-center justify-center rounded-full", TONES[tone])}>
					<Icon className={cn("size-6", spin && "animate-spin")} aria-hidden="true" />
				</div>
				<h1 className="mt-4 text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">{title}</h1>
				<p className="mt-1.5 max-w-sm text-sm text-[#64748B] dark:text-[#94A3B8]">{description}</p>
			</div>
			{children ? <div className="mt-6">{children}</div> : null}
		</section>
	);
}

// Where "Back to payroll" goes for the signed-in role
export function payrollHref(role: string | undefined) {
	if (role === "ADMIN") return "/admin/payroll";
	if (role === "FINANCE_MANAGER") return "/finance";
	if (role === "HR_MANAGER") return "/manager";
	return "/dashboard";
}
