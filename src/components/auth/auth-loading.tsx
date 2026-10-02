import { Loader2 } from "lucide-react";

export default function AuthLoading({
  label = "Verifying account",
}: {
  label?: string;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
        <Loader2 className="size-5 animate-spin" />
        {label}
      </div>
    </div>
  );
}
