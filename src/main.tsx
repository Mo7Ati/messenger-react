// import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./index.css"
import App from "./App.tsx"
import { AuthProvider } from "./contexts/auth-context"
import { Toaster } from "sonner"
import "./echo-config"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
      <Toaster position="top-center" />
    </AuthProvider>
  </QueryClientProvider>
  // </StrictMode>
)
