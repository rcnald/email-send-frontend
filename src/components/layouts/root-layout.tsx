import { Outlet } from "react-router"
import { FileStepper } from "../file-stepper"

export const RootLayout = () => {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center gap-10 px-4'>
      <div className='w-full max-w-100 gap-10 '>
        <FileStepper />
      </div>
      <Outlet />
    </div>
  )
}
