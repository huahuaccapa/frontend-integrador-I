import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "./button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from "../ui/select" 

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName


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

const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), "max-h-screen overflow-y-auto", className)}
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
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-4 text-center sm:text-left", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

const MultiStepSheet = ({ isOpen, onOpenChange, initialData, onSave, onChange, steps, options }) => {
  const [step, setStep] = React.useState(0)
  const [formData, setFormData] = React.useState(initialData)

  const handleNext = () => setStep((prevStep) => prevStep + 1)
  const handlePrev = () => setStep((prevStep) => prevStep - 1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value }
      if (name === 'academic_hours') {
        updatedData.lecture_hours = value * 3
      }
      onChange(name, value)
      return updatedData
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value }
      onChange(name, value)
      return updatedData
    })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }))
  }

  const currentStep = steps[step]

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent >
        <SheetHeader>
          <SheetTitle>{currentStep.title}</SheetTitle>
          <SheetDescription>{currentStep.description}</SheetDescription>
        </SheetHeader>
        <div>
          {currentStep.fields.map((field) => {
            if (field.id === 'short_name') {
              return (
                <div key={field.id} className="flex mb-2">
                  <label className="block mb-2 w-1/2 mr-2">
                    Tipología
                    {options && options.programTypes ? (
                      <Select
                        value={formData.program_type || ''}
                        onValueChange={(value) => handleSelectChange('program_type', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {options.programTypes.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </label>
                  <label className="block mb-2 w-1/2">
                    {field.label}
                    <Input
                      type={field.type}
                      name={field.id}
                      value={formData[field.id] || ''}
                      onChange={handleChange}
                      className="w-full p-2 mt-1 border rounded"
                    />
                  </label>
                </div>
              )
            }
            if (field.type === 'textarea') {
              return (
                <label key={field.id} className="block mb-2">
                  {field.label}
                  <Textarea
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </label>
              )
            }
            if (field.type === 'select') {
              let selectOptions = field.options || []
              if (field.id === 'professor_id') {
                selectOptions = options?.professors || []
              }
              if (field.id === 'area_id') {
                selectOptions = options?.areas || []
              }

              return (
                <label key={field.id} className="block mb-2">
                  {field.label}
                  <Select
                    value={formData[field.id] || ''}
                    onValueChange={(value) =>
                      handleSelectChange(field.id, value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectOptions.map((option) => (
                        <SelectItem
                          key={option.value || option.id}
                          value={option.value || option.id}
                        >
                          {option.label || option.name || option.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              )
            }
            if (field.type === 'file') {
              return (
                <label key={field.id} className="block mb-2">
                  {field.label}
                  <Input
                    type="file"
                    name={field.id}
                    accept={field.accept}
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </label>
              )
            }
            
            if (field.type === 'date') {
              return (
                <label key={field.id} className="block mb-2">
                  {field.label}
                  <Input
                    type="date"
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </label>
              )
            }
            return (
              <label key={field.id} className="block mb-2">
                {field.label}
                <Input
                  type={field.type}
                  name={field.id}
                  value={formData[field.id] || ''}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded "
                />
              </label>
            )
          })}
        </div>
        <SheetFooter>
          {step > 0 && <button className="btn" onClick={handlePrev}>Anterior</button>}
          {step < steps.length - 1 && <Button className="btn" onClick={handleNext}>Siguiente</Button>}
          {step === steps.length - 1 && <Button className="btn" onClick={() => onSave(formData)}>Guardar</Button>}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export {
  MultiStepSheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
