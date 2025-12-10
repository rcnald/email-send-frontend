import type { RouteObject } from "react-router-dom"
import { Register } from "@/pages/auth/register"

export const publicRoutes: RouteObject[] = [
  {
    path: "/register",
    Component: Register,
  },
]
