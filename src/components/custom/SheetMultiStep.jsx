import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const SheetMultiStep = SheetPrimitive.Root
const SheetMultiStepTrigger = SheetPrimitive.Trigger
const SheetMultiStepClose = SheetPrimitive.Close
const SheetMultiStepPortal = SheetPrimitive.Portal

const SheetMultiStepOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetMultiStepOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-10 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-20 left-0 h-full w-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left 2xl:max-w-2xl",
        right: "inset-y-0 right-0 h-full w-full max-w-lg border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm md:max-w-md min-w-[45vw]",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

const SheetMultiStepContent = React.forwardRef(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetMultiStepPortal>
      <SheetMultiStepOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          sheetVariants({ side }),
          "max-h-screen overflow-y-auto",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetMultiStepPortal>
  )
)
SheetMultiStepContent.displayName = SheetPrimitive.Content.displayName

const SheetMultiStepHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-4 text-center sm:text-left", className)} {...props} />
)
SheetMultiStepHeader.displayName = "SheetHeader"

const SheetMultiStepFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
SheetMultiStepFooter.displayName = "SheetFooter"

const SheetMultiStepTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
))
SheetMultiStepTitle.displayName = SheetPrimitive.Title.displayName

const SheetMultiStepDescription = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
SheetMultiStepDescription.displayName = SheetPrimitive.Description.displayName

export {
  SheetMultiStep,
  SheetMultiStepPortal,
  SheetMultiStepOverlay,
  SheetMultiStepTrigger,
  SheetMultiStepClose,
  SheetMultiStepContent,
  SheetMultiStepHeader,
  SheetMultiStepFooter,
  SheetMultiStepTitle,
  SheetMultiStepDescription,
}
