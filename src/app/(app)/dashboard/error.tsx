"use client";

import { RouteError } from "@/components/shared/route-error";

// Keeps the sidebar; only the page content shows the error
export default function DashboardError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} embedded homeHref="/dashboard" homeLabel="Back to overview" />;
}
