import { Outlet } from "react-router"
import { FileStepper } from "../file-stepper"

export const RootLayout = () => {
  return (
    <div className='grid min-h-screen w-full grid-cols-1 grid-rows-[200px_1fr] flex-col place-items-center items-center justify-center gap-10 p-4'>
      <div className='w-full max-w-100 gap-10'>
        <FileStepper />
      </div>
      <Outlet />
    </div>
  )
}
