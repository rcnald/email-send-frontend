import { createBrowserRouter } from "react-router-dom"

import { signedInRoutes } from "./signed-in"

import { signedOutRoutes } from "./signed-out"

// Inject Google Fonts and Tailwind v4-compatible font family CSS variables
;(function ensureFontsInjected() {
  if (typeof document === "undefined") return

  const id = "app-fonts-and-tokens"
  if (document.getElementById(id)) return

  // Google Fonts: preconnect + stylesheet (with rel=noopener on target=_blank not applicable here)
  const preconnect1 = document.createElement("link")
  preconnect1.rel = "preconnect"
  preconnect1.href = "https://fonts.googleapis.com"
  preconnect1.crossOrigin = "anonymous"
  document.head.appendChild(preconnect1)

  const preconnect2 = document.createElement("link")
  preconnect2.rel = "preconnect"
  preconnect2.href = "https://fonts.gstatic.com"
  preconnect2.crossOrigin = "anonymous"
  document.head.appendChild(preconnect2)

  const fonts = document.createElement("link")
  fonts.rel = "stylesheet"
  fonts.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;700&display=swap"
  document.head.appendChild(fonts)

  // Tailwind v4 tokens pattern: create CSS variables under :root for font families
  const style = document.createElement("style")
  style.id = id
  style.textContent = `
:root {
  --ff-plus-jakarta: "Plus Jakarta Sans", system-ui, sans-serif; /* new token */
  --ff-inter: "Inter", system-ui, sans-serif; /* new token */
  --ff-roboto-mono: "Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace; /* new token */
}
`
  document.head.appendChild(style)
})()

export const router = createBrowserRouter([
  ...signedOutRoutes,

  ...signedInRoutes,
])
