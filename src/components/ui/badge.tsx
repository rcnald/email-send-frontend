import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 font-medium text-xs leading-normal transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-1 border-[#28D7AC_]/20 bg-[radial-gradient(circle,rgba(242,204,212,0)_0%,#D4F7EE_100%)] text-[#28D7AC] shadow-[inset_0px_2px_1px_rgba(255,255,255,0.56)] [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-1 border-red-500/10 bg-[radial-gradient(circle,rgba(242,204,212,0)_0%,rgba(242,204,212,1)_100%)] text-[#BF0027] shadow-[inset_0px_2px_1px_rgba(255,255,255,0.56)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      data-slot='badge'
      {...props}
    />
  )
}

export { Badge, badgeVariants }
