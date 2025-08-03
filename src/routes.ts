import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "./components/layouts/root-layout"
import { UploadStep } from "./pages/upload-step"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "/upload",
        Component: UploadStep,
      },
      // {
      //   path: "/select-client",
      //   Component: ,
      // }
    ],
  },
])
