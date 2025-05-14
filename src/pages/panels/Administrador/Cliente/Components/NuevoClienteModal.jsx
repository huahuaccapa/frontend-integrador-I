// components/NuevoClienteModal.jsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function NuevoClienteModal() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Agregar Cliente</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nuevo Cliente</SheetTitle>
          <SheetDescription>
            Ingrese los datos del nuevo cliente.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-6 ">
      
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombres y Apellidos
            </Label>
            <Input id="name" placeholder="Nombre completo" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              DNI
            </Label>
            <Input id="name" placeholder="Nombre DNI" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              RUC
            </Label>
            <Input id="name" placeholder="Ejm:123456789" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Telefono
            </Label>
            <Input id="name" placeholder="Ejm. 987 654 321" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Direccion
            </Label>
            <Input id="name" placeholder="Ejm. Av. Los Rosales A -12" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Guardar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
