import { CheckIcon, ChevronRight, LoaderCircleIcon } from "lucide-react"
import { Slot } from "radix-ui"
import type React from "react"
import { createContext, useCallback, useContext, useState } from "react"

import { cn } from "@/lib/utils"

type StepperContextValue = {
  activeStep: number
  setActiveStep: (step: number) => void
  orientation: "horizontal" | "vertical"
}

type StepItemContextValue = {
  step: number
  state: StepState
  isDisabled: boolean
  isLoading: boolean
}

type StepState = "active" | "completed" | "inactive" | "loading"

const StepperContext = createContext<StepperContextValue | undefined>(undefined)
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
)

const useStepper = () => {
  const context = useContext(StepperContext)

  if (!context) {
    throw new Error("useStepper must be used within a Stepper")
  }
  return context
}

const useStepItem = () => {
  const context = useContext(StepItemContext)

  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem")
  }
  return context
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number
  value?: number
  onValueChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
}

function Stepper({
  defaultValue = 0,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  ...props
}: StepperProps) {
  const [activeStep, setInternalStep] = useState(defaultValue)

  const setActiveStep = useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step)
      }
      onValueChange?.(step)
    },
    [value, onValueChange]
  )

  const currentStep = value ?? activeStep

  return (
    <StepperContext.Provider
      value={{
        activeStep: currentStep,
        setActiveStep,
        orientation,
      }}
    >
      <div
        className={cn(
          "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        data-orientation={orientation}
        data-slot='stepper'
        {...props}
      />
    </StepperContext.Provider>
  )
}

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  completed?: boolean
  disabled?: boolean
  loading?: boolean
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper()

  let state: StepState = "inactive"

  const isCompleted = completed || step < activeStep
  const isActive = step === activeStep
  const isLoading = loading && step === activeStep
  // const isDisabled = disabled || (step > activeStep && !isLoading)

  if (isCompleted) {
    state = "completed"
  }

  if (isActive) {
    state = "active"
  }

  return (
    <StepItemContext.Provider
      value={{ step, state, isDisabled: disabled, isLoading }}
    >
      <div
        className={cn(
          "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
          className
        )}
        data-slot='stepper-item'
        data-state={state}
        {...(isLoading ? { "data-loading": true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  )
}

interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

function StepperTrigger({
  asChild = false,
  className,
  children,
  ...props
}: StepperTriggerProps) {
  const { setActiveStep } = useStepper()
  const { step, isDisabled } = useStepItem()

  if (asChild) {
    return (
      <Slot.Root className={className} data-slot='stepper-trigger'>
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      className={cn(
        "inline-flex items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      data-slot='stepper-trigger'
      disabled={isDisabled}
      onClick={() => setActiveStep(step)}
      {...props}
    >
      {children}
    </button>
  )
}

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

function StepperIndicator({
  asChild = false,
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { state, step, isLoading } = useStepItem()

  return (
    <span
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs data-[state=active]:bg-primary data-[state=completed]:bg-green-600 data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground",
        className
      )}
      data-slot='stepper-indicator'
      data-state={state}
      {...props}
    >
      {asChild ? (
        <>
          <span className='transition-all group-data-[state=completed]/step:scale-0 group-data-loading/step:scale-0 group-data-[state=completed]/step:opacity-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none'>
            {children}
          </span>

          <CheckIcon
            aria-hidden='true'
            className='absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100'
            size={16}
          />
        </>
      ) : (
        <>
          <span className='transition-all group-data-[state=completed]/step:scale-0 group-data-loading/step:scale-0 group-data-[state=completed]/step:opacity-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none'>
            {step}
          </span>
          <CheckIcon
            aria-hidden='true'
            className='absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100'
            size={16}
          />
          {isLoading && (
            <span className='absolute transition-all'>
              <LoaderCircleIcon
                aria-hidden='true'
                className='animate-spin'
                size={14}
              />
            </span>
          )}
        </>
      )}
    </span>
  )
}

function StepperTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("shrink-0 font-medium text-sm", className)}
      data-slot='stepper-title'
      {...props}
    />
  )
}

function StepperDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      data-slot='stepper-description'
      {...props}
    />
  )
}

function StepperSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex w-full items-center justify-center", className)}
      data-slot='stepper-separator'
      {...props}
    >
      <ChevronRight className='text-muted-foreground' />
    </div>
  )
}

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
}
