import { describe, expect, it } from "vitest"
import { getPageTitle } from "./seo"

describe("getPageTitle", () => {
  it("returns route-specific titles using the Invoice brand", () => {
    expect(getPageTitle("/sign-in")).toBe("Sign In | Invoice")
    expect(getPageTitle("/sign-up")).toBe("Sign Up | Invoice")
    expect(getPageTitle("/upload")).toBe("Upload | Invoice")
    expect(getPageTitle("/select-client")).toBe("Select Client | Invoice")
    expect(getPageTitle("/resume")).toBe("Resume | Invoice")
  })

  it("returns the app default title for unknown routes", () => {
    expect(getPageTitle("/unknown")).toBe("Invoice")
  })
})
