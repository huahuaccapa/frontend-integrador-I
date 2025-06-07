import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from 'axios';
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export function TableDemoProveedor({ proveedores, onProveedorDeleted }) {
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

  const handleDelete = async (id) => {
    try {
      const confirmar = window.confirm("¿Estás seguro de eliminar este proveedor?");
      if (!confirmar) return;

      await axios.delete(`http://localhost:8080/api/proveedores/${id}`);
      onProveedorDeleted();
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente",
        variant: "default",
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Table className="mt-4">
      <TableCaption>Lista de Proveedores Registrados ({proveedores.length})</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>RUC</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Rubro</TableHead>
          {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {proveedores.map((proveedor) => (
          <TableRow key={proveedor.id}>
            <TableCell className="font-medium">{proveedor.ruc || '-'}</TableCell>
            <TableCell>{proveedor.nombre || '-'}</TableCell>
            <TableCell>{proveedor.telefono || '-'}</TableCell>
            <TableCell>{proveedor.correo || '-'}</TableCell>
            <TableCell>{proveedor.ubicacion || '-'}</TableCell>
            <TableCell>{proveedor.rubro || '-'}</TableCell>
            {isAdmin && (
              <TableCell className="text-right">
                <EditProveedorDialog 
                  proveedor={proveedor} 
                  onProveedorUpdated={onProveedorDeleted} 
                />
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(proveedor.id)}
                  className="ml-2"
                >
                  Eliminar
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EditProveedorDialog({ proveedor, onProveedorUpdated }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ruc: proveedor.ruc,
      tipo: proveedor.tipo || "",
      nombre: proveedor.nombre,
      direccion: proveedor.direccion || "",
      pais: proveedor.pais || "",
      region: proveedor.region || "",
      distrito: proveedor.distrito || "",
      rubro: proveedor.rubro || "",
      tipoProductos: proveedor.tipoProductos || "",
      telefono: proveedor.telefono || "",
      correo: proveedor.correo,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/proveedores/${proveedor.id}`, data);

      if (response.status === 200) {
        toast({
          title: "Éxito",
          description: "Proveedor actualizado correctamente",
          variant: "default",
        });
        onProveedorUpdated();
      }
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent className="w-[900px]">
        <DialogHeader>
          <DialogTitle>Editar Proveedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos Generales</h3>
            {[
              { id: "ruc", label: "RUC*", required: true },
              { id: "tipo", label: "Tipo" },
              { id: "nombre", label: "Nombre*", required: true },
              { id: "direccion", label: "Dirección" },
              { id: "pais", label: "País" },
              { id: "region", label: "Región" },
              { id: "distrito", label: "Distrito" },
              { id: "rubro", label: "Rubro" },
              { id: "tipoProductos", label: "Tipo de Productos" },
            ].map(({ id, label, required }) => (
              <div key={id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={id} className="text-right">
                  {label}
                </Label>
                <Input
                  id={id}
                  {...register(id, {
                    required: required ? "Este campo es obligatorio" : false,
                  })}
                  className="col-span-3"
                />
                {errors[id] && (
                  <span className="col-span-4 text-right text-sm text-red-500">
                    {errors[id].message}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            {[
              {
                id: "telefono",
                label: "Teléfono",
                type: "tel",
              },
              {
                id: "correo",
                label: "Correo*",
                type: "email",
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                errorMessage: "Ingrese un correo válido",
              },
            ].map(({ id, label, type = "text", required, pattern, errorMessage }) => (
              <div key={id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={id} className="text-right">
                  {label}
                </Label>
                <Input
                  id={id}
                  type={type}
                  {...register(id, {
                    required: required ? "Este campo es obligatorio" : false,
                    pattern: pattern ? { value: pattern, message: errorMessage } : undefined,
                  })}
                  className="col-span-3"
                />
                {errors[id] && (
                  <span className="col-span-4 text-right text-sm text-red-500">
                    {errors[id].message}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="col-span-2 flex justify-end mt-4">
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}