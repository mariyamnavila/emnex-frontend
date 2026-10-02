import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

type UserAvatarSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<UserAvatarSize, { box: string; text: string }> = {
	sm: { box: "size-6", text: "text-[10px]" },
	md: { box: "size-8", text: "text-xs" },
	lg: { box: "size-14", text: "text-sm" },
};

interface UserAvatarProps {
	name: string;
	src?: string | null;
	size?: UserAvatarSize;
	className?: string;
}

/**
 * The one avatar used everywhere (tables, menus, sheets, profiles):
 * image when available, styled initials fallback otherwise.
 */
export function UserAvatar({
	name,
	src,
	size = "md",
	className,
}: UserAvatarProps) {
	const { box, text } = SIZE_CLASSES[size];

	return (
		<Avatar
			className={cn(
				"shrink-0 border border-[#E2E8F0] dark:border-[#1E293B]",
				box,
				className,
			)}
		>
			<AvatarImage src={src ?? undefined} alt={name} />
			<AvatarFallback
				className={cn(
					"bg-[#EFF6FF] font-semibold text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]",
					text,
				)}
			>
				{getInitials(name)}
			</AvatarFallback>
		</Avatar>
	);
}
