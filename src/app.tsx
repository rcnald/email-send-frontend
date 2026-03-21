import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"
import { router } from "./routes/index"

const queryClient = new QueryClient()

export function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  )
}
