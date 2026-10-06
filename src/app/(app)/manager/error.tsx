"use client";

import { RouteError } from "@/components/shared/route-error";

// Keeps the sidebar; only the page content shows the error
export default function ManagerError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} embedded homeHref="/manager" homeLabel="Back to overview" />;
}
