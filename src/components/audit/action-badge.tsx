import { StatusBadge } from "@/components/shared";
import { describeAction } from "@/lib/audit";

export function ActionBadge({ action }: { action: string }) {
	const { label, tone } = describeAction(action);
	return <StatusBadge status={action} tone={tone} label={label} />;
}
