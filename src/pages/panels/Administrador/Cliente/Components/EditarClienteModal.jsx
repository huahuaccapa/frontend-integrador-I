// components/EditarClienteModal.jsx
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

export default function EditarClienteModal({ cliente, onGuardar }) {
  const handleSubmit = () => {
    // Aquí podrías manejar cambios con un formulario controlado si lo deseas.
    if (onGuardar) onGuardar(cliente.id)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar Cliente</SheetTitle>
          <SheetDescription>Modifique los datos del cliente.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">Nombre</Label>
            <Input id="edit-name" defaultValue={cliente.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-RUC" className="text-right">RUC</Label>
            <Input id="edit-RUC" defaultValue={cliente.RUC} className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" onClick={handleSubmit}>Guardar Cambios</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
