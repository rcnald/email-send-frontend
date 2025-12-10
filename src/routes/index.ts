import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "@/components/layouts/root-layout"
import { privateRoutes } from "./private.routes"
import { publicRoutes } from "./public.routes"

export const router = createBrowserRouter([
  ...publicRoutes,
  {
    path: "/",
    Component: RootLayout,
    children: privateRoutes,
  },
])
