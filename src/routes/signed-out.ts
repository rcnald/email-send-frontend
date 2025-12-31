import type { RouteObject } from "react-router-dom"
import { SignIn } from "@/pages/auth/sign-in"
import { SignUp } from "@/pages/auth/sign-up"
import { AuthLayout } from "@/pages/layout/auth"

export const signedOutRoutes: RouteObject[] = [
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "sign-in",
        Component: SignIn,
      },
      {
        path: "sign-up",
        Component: SignUp,
      },
    ],
  },
]
