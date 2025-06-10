import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormCliente } from "./FormCliente";

export function RegistrarCliente({ onClienteAdded }) {
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

  if (!isAdmin) {
    return null; // No renderiza nada si no es admin
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="mb-4">Nuevo Cliente</Button>
      </SheetTrigger>
      <SheetContent className='p-4 bg-green-800'>
        <FormCliente onSuccess={onClienteAdded} />
      </SheetContent>
    </Sheet>
  );
}