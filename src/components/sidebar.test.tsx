import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { Sidebar } from "./sidebar"

const renderSidebar = () => {
  const queryClient = new QueryClient()

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/upload"]}>
        <Sidebar />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe("Sidebar", () => {
  it("renders mobile default as collapsed relative layout", () => {
    const markup = renderSidebar()

    expect(markup).toContain("relative")
    expect(markup).not.toContain("fixed inset-y-0 left-0 z-40")
    expect(markup).toContain('aria-label="Expandir sidebar"')
  })

  it("renders non-navigatable workflow entries as disabled links", () => {
    const markup = renderSidebar()

    expect(markup).toContain('href="/select-client"')
    expect(markup).toContain('aria-disabled="true"')
    expect(markup).toContain("pointer-events-none")
  })
})
