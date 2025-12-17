import type { RouteObject } from "react-router-dom"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { Login } from "@/pages/auth/login"
import { Register } from "@/pages/auth/register"

export const publicRoutes: RouteObject[] = [
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
]
