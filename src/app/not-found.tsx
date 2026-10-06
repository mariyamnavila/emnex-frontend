import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { StatusScreen } from "@/components/shared/status-screen";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      icon={Compass}
      tone="blue"
      title="Page not found"
      message="The page you're looking for doesn't exist or may have been moved. Check the URL, or head back to safe ground."
      actions={
        <Button
          asChild
          className="h-10 rounded-lg bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
        >
          <Link href="/" className="inline-flex items-center gap-1.5">
            <Home className="size-4" />
            Back to home
          </Link>
        </Button>
      }
    />
  );
}
