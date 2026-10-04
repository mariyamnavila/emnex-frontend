"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput, PasswordRules } from "@/components/auth/password-input";
import { ChartCard } from "@/components/dashboard/chart-card";
import { DetailList, DetailRow, FormField, PageHeader, StatusBadge, UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useChangePassword, useGetMe, useUploadAvatar } from "@/hooks/auth.hook";
import { formatDate, formatRoleName } from "@/lib/utils";
import { changePasswordSchema, type ChangePasswordValues } from "@/validation/auth.validation";

// Same limits as the backend upload (multer)
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX_MB = 5;

// One profile page for every role: who you are, your photo, your password
export function ProfileView() {
	const { data: me, isLoading, isError } = useGetMe();
	// A fresh form after each change; reset() leaves react-hook-form's inputs unregistered under the React Compiler
	const [passwordFormKey, setPasswordFormKey] = useState(0);

	return (
		<div className="space-y-6">
			<PageHeader title="Profile" description="Your account details, profile photo and password." />

			{me?.mustChangePassword ? (
				<div className="flex items-start gap-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E] dark:border-[#78350F] dark:bg-[#451A03]/40 dark:text-[#FCD34D]">
					<AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					<p>You&apos;re signed in with a temporary password. Set your own password below.</p>
				</div>
			) : null}

			<div className="grid gap-4 lg:grid-cols-3">
				<ChartCard title="Profile photo" isLoading={isLoading} isError={isError}>
					{me ? <AvatarCard name={me.name} email={me.email} avatar={me.avatar} role={me.role.name} /> : null}
				</ChartCard>

				<ChartCard
					title="Account"
					description="Managed by your organization"
					isLoading={isLoading}
					isError={isError}
					className="lg:col-span-2"
				>
					{me ? (
						<DetailList bordered={false}>
							<DetailRow label="Full name">{me.name}</DetailRow>
							<DetailRow label="Email">
								<span className="flex flex-wrap items-center gap-2">
									<span className="break-all">{me.email}</span>
									<StatusBadge
										status={me.emailVerified ? "ACTIVE" : "PENDING"}
										label={me.emailVerified ? "Verified" : "Not verified"}
									/>
								</span>
							</DetailRow>
							<DetailRow label="Role">{formatRoleName(me.role.name)}</DetailRow>
							<DetailRow label="Organization">{me.organization.name}</DetailRow>
							<DetailRow label="Sign-in">
								{me.authProvider === "GOOGLE" ? "Google account" : "Email and password"}
							</DetailRow>
							<DetailRow label="Member since">{formatDate(me.createdAt)}</DetailRow>
						</DetailList>
					) : null}
				</ChartCard>
			</div>

			<ChartCard
				title="Change password"
				description="Changing it signs you out everywhere else."
				isLoading={isLoading}
				isError={isError}
			>
				{me?.authProvider === "GOOGLE" ? (
					<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
						You sign in with Google, so there&apos;s no EmNex password to change.
					</p>
				) : (
					<ChangePasswordForm key={passwordFormKey} onChanged={() => setPasswordFormKey((key) => key + 1)} />
				)}
			</ChartCard>
		</div>
	);
}

function AvatarCard({
	name,
	email,
	avatar,
	role,
}: {
	name: string;
	email: string;
	avatar: string | null;
	role: string;
}) {
	const upload = useUploadAvatar();
	const inputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);

	// Free the local preview once the uploaded photo replaces it
	useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview]);

	function pick(file: File | undefined) {
		if (!file) return;
		if (!AVATAR_TYPES.includes(file.type)) return toast.error("Use a JPG, PNG or WebP image");
		if (file.size > AVATAR_MAX_MB * 1024 * 1024) return toast.error(`The photo must be ${AVATAR_MAX_MB} MB or smaller`);
		setPreview(URL.createObjectURL(file));
		upload.mutate(file, { onSettled: () => setPreview(null) });
	}

	return (
		<div className="flex flex-col items-center text-center">
			<div className="relative">
				<UserAvatar name={name} src={preview ?? avatar} size="xl" />
				{upload.isPending ? (
					<span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#0F172A]/40">
						<Loader2 className="size-6 animate-spin text-white" aria-label="Uploading" />
					</span>
				) : null}
			</div>
			<p className="mt-3 text-base font-semibold text-[#0F172A] dark:text-white">{name}</p>
			<p className="text-sm break-all text-[#64748B] dark:text-[#94A3B8]">{email}</p>
			<p className="mt-1 text-xs font-medium text-[#2563EB] dark:text-[#60A5FA]">{formatRoleName(role)}</p>

			<input
				ref={inputRef}
				type="file"
				accept={AVATAR_TYPES.join(",")}
				className="sr-only"
				tabIndex={-1}
				onChange={(event) => {
					pick(event.target.files?.[0]);
					event.target.value = "";
				}}
			/>
			<Button
				variant="outline"
				size="sm"
				disabled={upload.isPending}
				onClick={() => inputRef.current?.click()}
				className="mt-4 border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
			>
				<Camera className="size-3.5" />
				{avatar ? "Change photo" : "Upload photo"}
			</Button>
			<p className="mt-2 text-[11px] text-[#94A3B8]">JPG, PNG or WebP, up to {AVATAR_MAX_MB} MB</p>
		</div>
	);
}

function ChangePasswordForm({ onChanged }: { onChanged: () => void }) {
	const changePassword = useChangePassword();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ChangePasswordValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
	});
	const newPassword = useWatch({ control, name: "newPassword" }) ?? "";

	return (
		<form
			onSubmit={handleSubmit((values) => changePassword.mutate(values, { onSuccess: onChanged }))}
			className="grid max-w-xl gap-4"
			noValidate
		>
			<FormField id="current-password" label="Current password" error={errors.currentPassword?.message}>
				<PasswordInput
					id="current-password"
					autoComplete="current-password"
					aria-invalid={Boolean(errors.currentPassword)}
					{...register("currentPassword")}
				/>
			</FormField>
			<FormField id="new-password" label="New password" error={errors.newPassword?.message}>
				<PasswordInput
					id="new-password"
					autoComplete="new-password"
					aria-invalid={Boolean(errors.newPassword)}
					{...register("newPassword")}
				/>
			</FormField>
			<PasswordRules value={newPassword} />
			<FormField id="confirm-password" label="Confirm new password" error={errors.confirmPassword?.message}>
				<PasswordInput
					id="confirm-password"
					autoComplete="new-password"
					aria-invalid={Boolean(errors.confirmPassword)}
					{...register("confirmPassword")}
				/>
			</FormField>
			<div>
				<Button
					type="submit"
					disabled={changePassword.isPending}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{changePassword.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
					Change password
				</Button>
			</div>
		</form>
	);
}
