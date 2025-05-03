import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormCliente } from "./FormCliente";

export function SheetDemo({ onClienteAdded }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="mb-4">+ Nuevo Cliente</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Registro de Cliente</SheetTitle>
        </SheetHeader>
        <FormCliente onSuccess={onClienteAdded} />
      </SheetContent>
    </Sheet>
  );
}