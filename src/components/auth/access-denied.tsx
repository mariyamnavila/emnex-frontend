import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { StatusScreen } from "@/components/shared/status-screen";
import { Button } from "@/components/ui/button";

/** `homeHref` = the viewer's role home (e.g. /admin) — defaults to /dashboard */
export default function AccessDenied({ homeHref = "/dashboard" }: { homeHref?: string }) {
  return (
    <StatusScreen
      embedded
      code="403"
      icon={ShieldAlert}
      tone="amber"
      title="Access denied"
      message="You don't have permission to view this page. Your role doesn't include the required access — ask an admin if you think this is a mistake."
      actions={
        <Button
          asChild
          className="h-10 rounded-lg bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
        >
          <Link href={homeHref} className="inline-flex items-center gap-1.5">
            <ArrowLeft className="size-4" />
            Back to your dashboard
          </Link>
        </Button>
      }
    />
  );
}
