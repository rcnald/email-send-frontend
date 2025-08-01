import { Send, Upload, User } from "lucide-react"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

export function FileStepper() {
  return (
    <div className='mx-auto w-full max-w-xl space-y-8 text-center'>
      <Stepper defaultValue={1}>
        <StepperItem className='not-last:flex-1' step={1}>
          <StepperTrigger>
            <StepperIndicator asChild>
              <Upload aria-hidden='true' size={14} />
            </StepperIndicator>
            <StepperTitle>Anexar</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem className='not-last:flex-1' step={2}>
          <StepperTrigger>
            <StepperIndicator asChild>
              <User aria-hidden='true' size={14} />
            </StepperIndicator>
            <StepperTitle>Cliente</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem className='not-last:flex-1' disabled={true} step={3}>
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
