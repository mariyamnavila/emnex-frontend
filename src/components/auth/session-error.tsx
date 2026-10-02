import { RotateCcw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SessionError({
  message,
  onRetry,
  isRetrying = false,
}: {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-[#FFFBEB] text-[#D97706]">
          <WifiOff className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#0F172A] dark:text-white">
            Can&apos;t reach EmNex right now
          </h1>
          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            {message ?? "The server didn't respond."} You&apos;re still signed in.
          </p>
        </div>
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          className="h-9 gap-2 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
        >
          <RotateCcw className="size-4" />
          {isRetrying ? "Retrying..." : "Try again"}
        </Button>
      </div>
    </div>
  );
}
