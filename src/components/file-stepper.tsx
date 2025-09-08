import { Send, Upload, User } from "lucide-react"
import type { ComponentProps } from "react"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { cn } from "@/lib/utils"
import { useClientStore } from "@/store/client-store"
import { useFileStore } from "@/store/file-store"

export function FileStepper({ className, ...props }: ComponentProps<"div">) {
  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  const hasClientToProceed = useClientStore((state) => Boolean(state.client))

  return (
    <div
      className={cn("mx-auto w-full space-y-8 text-center", className)}
      {...props}
    >
      <Stepper defaultValue={1}>
        <StepperItem className='not-last:flex-1' pathname='/upload' step={1}>
          <StepperTrigger>
            <StepperIndicator asChild>
              <Upload aria-hidden='true' size={14} />
            </StepperIndicator>
            <StepperTitle>Anexar</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem
          className='not-last:flex-1'
          disabled={!hasFilesToProceed}
          pathname='/select-client'
          step={2}
        >
          <StepperTrigger>
            <StepperIndicator asChild>
              <User aria-hidden='true' size={14} />
            </StepperIndicator>
            <StepperTitle>Cliente</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem
          className='not-last:flex-1'
          disabled={!(hasClientToProceed && hasFilesToProceed)}
          pathname='/resume'
          step={3}
        >
          <StepperTrigger>
            <StepperIndicator asChild>
              <Send aria-hidden='true' size={14} />
            </StepperIndicator>
            <StepperTitle>Enviar</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    </div>
  )
}
