import type { RouteObject } from "react-router-dom"
import { ResumeStep } from "@/pages/app/resume-step"
import { SelectClientStep } from "@/pages/app/select-client"
import { UploadStep } from "@/pages/app/upload-step"
import { AppLayout } from "@/pages/layout/app"

export const signedInRoutes: RouteObject[] = [
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "/upload",
        Component: UploadStep,
      },
      {
        path: "/select-client",
        Component: SelectClientStep,
      },
      {
        path: "/resume",
        Component: ResumeStep,
      },
    ],
  },
]
