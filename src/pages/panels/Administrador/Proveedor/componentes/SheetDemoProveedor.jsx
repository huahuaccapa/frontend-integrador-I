//src\pages\panels\Administrador\Proveedor\componentes\SheetDemoProveedor.jsx
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FormProveedor } from "./FormProveedor";

export function SheetDemoProveedor({ onProveedorAdded }) {
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

  if (!isAdmin) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="mb-4">+ Nuevo Proveedor</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Registro de Proveedor</SheetTitle>
        </SheetHeader>
        <FormProveedor onSuccess={onProveedorAdded} />
      </SheetContent>
    </Sheet>
  );
}