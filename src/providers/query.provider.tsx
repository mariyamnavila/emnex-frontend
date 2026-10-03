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
    if (error instanceof ApiError && error.statusCode === 401 && !isAuthQuery) {
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
        staleTime: 30_000,
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
