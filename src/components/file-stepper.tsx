import { Send, Upload, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { useFileStore } from "@/store/file-store"

export function FileStepper() {
  const { pathname } = useLocation()

  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  return (
    <div className='mx-auto w-full space-y-8 text-center'>
      <Stepper defaultValue={1}>
        <StepperItem className='not-last:flex-1' step={1}>
          <StepperTrigger setAsActiveStep={pathname === "/upload"}>
            <Link className='flex items-center gap-3' to={"/upload"}>
              <StepperIndicator asChild>
                <Upload aria-hidden='true' size={14} />
              </StepperIndicator>
              <StepperTitle>Anexar</StepperTitle>
            </Link>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem
          className='not-last:flex-1'
          disabled={!hasFilesToProceed}
          step={2}
        >
          <StepperTrigger setAsActiveStep={pathname === "/select-client"}>
            <Link className='flex items-center gap-3' to={"/select-client"}>
              <StepperIndicator asChild>
                <User aria-hidden='true' size={14} />
              </StepperIndicator>
              <StepperTitle>Cliente</StepperTitle>
            </Link>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem className='not-last:flex-1' disabled={true} step={3}>
          <StepperTrigger>
            <Link className='flex items-center gap-3' to={"/send"}>
              <StepperIndicator asChild>
                <Send aria-hidden='true' size={14} />
              </StepperIndicator>
              <StepperTitle>Enviar</StepperTitle>
            </Link>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    </div>
  )
}
