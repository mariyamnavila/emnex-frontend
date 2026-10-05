"use client";

import { useState } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ApiError } from "@/lib/api";

// 4xx errors won't fix themselves on retry (and retries eat the rate limit)
const shouldRetry = (failureCount: number, error: Error) => {
  if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
    return false;
  }
  return failureCount < 1;
};

const createQueryClient = () => {
  // A 401 here means the token refresh in lib/api.ts also failed → session is over.
  // Re-checking /auth/me makes RoleGuard send the user to /login.
  const onError = (error: Error, queryKey?: readonly unknown[]) => {
    const isAuthQuery = queryKey?.[0] === "auth";
    // 401 → session ended (RoleGuard sends to login). 403 → permission likely
    // changed under the user, so refetch /auth/me to correct the UI immediately.
    if (error instanceof ApiError && !isAuthQuery && (error.statusCode === 401 || error.statusCode === 403)) {
      void client.invalidateQueries({ queryKey: ["auth", "me"] });
    }
  };

  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => onError(error, query.queryKey),
    }),
    mutationCache: new MutationCache({
      onError: (error) => onError(error),
    }),
    defaultOptions: {
      queries: {
        // Data here changes on user actions (which invalidate their keys), not
        // second-to-second — so keep it fresh for a couple of minutes and in
        // cache for longer. Revisiting a page within the window is instant
        // instead of cold-fetching from the (distant) database again.
        staleTime: 2 * 60_000,
        gcTime: 15 * 60_000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
    },
  });

  return client;
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
