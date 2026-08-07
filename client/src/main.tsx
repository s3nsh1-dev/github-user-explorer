import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import ModeContextProvider from "./context/ModeContextProvider.tsx";
import { NotFoundError, RateLimitError } from "./helper/githubErrors";

/**
 * Fetch policy for every query in the app, in one place.
 *
 * `new QueryClient()` took the library default of three retries with
 * exponential backoff, which turns one failed request into four. Against a
 * rate-limited API that is self-reinforcing: the response that says "you have
 * made too many requests" is answered with three more. A missing user cost
 * four round trips to learn it was still missing.
 *
 * `gcTime` is the v5 name for what v4 called `cacheTime` — the commented-out
 * block P02 deleted was written against the old API.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Branching on the typed errors from helper/githubErrors rather than
        // on message strings: a reworded message must not silently change
        // retry behaviour.
        if (error instanceof RateLimitError) return false; // retrying makes it worse
        if (error instanceof NotFoundError) return false; // a 404 will not become a 200
        return failureCount < 1;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModeContextProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ModeContextProvider>
  </StrictMode>
);
