import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"

import { AuthProvider } from "@/features/auth/auth-context"
import { OnlineUsersProvider } from "@/contexts/online-users-context"
import { isApiError } from "@/lib/api-error"

import "@/app/echo-config"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      // Don't retry on 4xx (e.g. 404) — they won't succeed. Only retry on 5xx or network.
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) return false
        return failureCount < 2
      },
    },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <OnlineUsersProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-center" />
          </AuthProvider>
        </OnlineUsersProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

