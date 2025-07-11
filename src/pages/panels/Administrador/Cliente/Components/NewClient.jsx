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
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'ADMIN';
  const isEmpleado = userRole === 'EMPLEADO';

  // Permitir acceso solo a ADMIN o EMPLEADO
  if (!isAdmin && !isEmpleado) {
    return null;
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