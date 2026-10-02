import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccessDenied() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#FEF2F2] dark:bg-[#450A0A]">
          <ShieldAlert className="size-8 text-[#DC2626]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A] dark:text-white">
            You don&apos;t have access to this page
          </h1>
          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Your role doesn&apos;t include the required permissions.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
