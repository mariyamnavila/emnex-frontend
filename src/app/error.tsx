"use client";

import { RouteError } from "@/components/shared/route-error";

export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} />;
}
