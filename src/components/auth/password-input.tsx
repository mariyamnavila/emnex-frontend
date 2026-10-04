"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, Lock } from "lucide-react";
import { fieldClass } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PASSWORD_RULES } from "@/validation/auth.validation";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
	/** Lock icon on the left (login / register style) */
	withIcon?: boolean;
};

// Password field with a show/hide toggle; spread react-hook-form's register() into it
export function PasswordInput({ withIcon = false, className, ...props }: PasswordInputProps) {
	const [visible, setVisible] = useState(false);
	return (
		<div className="relative">
			{withIcon ? (
				<Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
			) : null}
			<Input
				{...props}
				type={visible ? "text" : "password"}
				className={cn("h-10 pr-10", withIcon && "pl-9", fieldClass, className)}
			/>
			<button
				type="button"
				onClick={() => setVisible((shown) => !shown)}
				className="absolute top-1/2 right-3 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
				aria-label={visible ? "Hide password" : "Show password"}
			>
				{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
			</button>
		</div>
	);
}

// Live checklist of the password rules for what's typed so far
export function PasswordRules({ value }: { value: string }) {
	return (
		<ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2" aria-label="Password requirements">
			{PASSWORD_RULES.map((rule) => {
				const met = rule.test(value);
				return (
					<li
						key={rule.label}
						className={cn(
							"flex items-center gap-1.5 text-[11px]",
							met ? "text-[#16A34A] dark:text-[#4ADE80]" : "text-[#64748B] dark:text-[#94A3B8]",
						)}
					>
						{met ? (
							<Check className="size-3" aria-hidden="true" />
						) : (
							<span className="size-1 rounded-full bg-current" aria-hidden="true" />
						)}
						{rule.label}
						<span className="sr-only">{met ? "(done)" : "(missing)"}</span>
					</li>
				);
			})}
		</ul>
	);
}
