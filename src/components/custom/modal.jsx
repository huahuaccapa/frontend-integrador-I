import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/custom/button"

const Modal = ({ open, setOpen, size, title, children, callBack, description }) => {
  const sizeHash = {
    sm: "sm:max-w-[320px]",
    md: "sm:max-w-[500px]",
    lg: "sm:max-w-[800px]",
    xl: "sm:max-w-[1140px]",
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (callBack) {
      await callBack()
    }
  }


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={sizeHash[size]}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cerrar
              </Button>
            </DialogClose>
            {callBack && (
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  variant="success"
                >
                  Guardar
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Modal