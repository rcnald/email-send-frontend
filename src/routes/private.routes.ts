import type { RouteObject } from "react-router-dom"
import { ResumeStep } from "@/pages/resume-step"
import { SelectClientStep } from "@/pages/select-client-step"
import { UploadStep } from "@/pages/upload-step"

export const privateRoutes: RouteObject[] = [
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
]
