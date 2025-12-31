import { createBrowserRouter } from "react-router-dom"
import { signedInRoutes } from "./signed-in"
import { signedOutRoutes } from "./signed-out"

export const router = createBrowserRouter([
  ...signedOutRoutes,
  ...signedInRoutes,
])
