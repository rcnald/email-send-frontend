import { ArrowRightIcon } from "lucide-react"
import { FileStepper } from "./components/file-stepper"
import { FileUpload } from "./components/file-upload"
import { Button } from "./components/ui/button"

export function App() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center px-4'>
      <div className='grid w-full max-w-100 grid-cols-1 gap-10 '>
        <FileStepper />
        <FileUpload />

        <Button
          className='group w-full place-self-end lg:w-fit'
          variant='default'
        >
          Continuar
          <ArrowRightIcon
            aria-hidden='true'
            className='-me-1 opacity-60 transition-transform group-hover:translate-x-0.5'
            size={16}
          />
        </Button>
      </div>
    </div>
  )
}
