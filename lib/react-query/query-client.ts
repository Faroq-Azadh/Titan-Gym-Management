import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/errors";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays fresh for 1 minute before refetching in background
        staleTime: 60 * 1000,
        // Keep inactive cache in memory for 10 minutes
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: "always",
        retry: (failureCount, error) => {
          // Do not retry on client-side errors (401 Unauthorized, 403 Forbidden, 404 Not Found)
          if (error instanceof ApiError) {
            if (error.status === 401 || error.status === 403 || error.status === 404) {
              return false;
            }
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        // include pending queries in dehydration for SSR prefetching
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render.
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
