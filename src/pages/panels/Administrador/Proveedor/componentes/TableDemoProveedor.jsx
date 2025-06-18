//src\pages\panels\Administrador\Proveedor\componentes\TableDemoProveedor.jsx
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
import ServiceProveedores from "@/api/ServiceProveedores";
import { Proveedores } from "../proveedor";

export function TableDemoProveedor({ proveedores, onProveedorDeleted , onProveedorUpdated}) {
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

 const handleDelete = async (id) => {
    try {
      const confirmar = window.confirm("¿Estás seguro de eliminar este proveedor?");
      if (!confirmar) return;

      await onProveedorDeleted(id); // Usa la función del padre
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
          <TableHead>Tipo de Producto</TableHead>
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
            <TableCell>{proveedor.ciudad || '-'}</TableCell>
            <TableCell>{proveedor.tipoProducto || '-'}</TableCell>
            {isAdmin && (
              <TableCell className="text-right">
                <EditProveedorDialog 
                  proveedor={proveedor} 
                  onProveedorUpdated={onProveedorUpdated} 
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
      tipo: proveedor.tipoProveedor,
      nombre: proveedor.nombre || "",
      codigoPostal:proveedor.codigoPostal || "",
      paisProveedor: proveedor.paisProveedor || "",
      ciudad: proveedor.ciudad || "",
      region: proveedor.region || "",
      distrito: proveedor.distrito || "",
      direccion: proveedor.direccion || "",
      rubro: proveedor.rubro || "",
      tipoProducto: proveedor.tipoProducto || "",
      telefono: proveedor.telefono || "",
      correo: proveedor.correo,
    },
  });

   const onSubmit = async (data) => {
    try {
      await ServiceProveedores.updateProveedor(proveedor.id, data);
      toast({
        title: "Éxito",
        description: "Proveedor actualizado correctamente",
        variant: "default",
      });
      onProveedorUpdated(); // Notifica al padre para actualizar
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
  <DialogContent className="w-[600px] max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Editar Proveedor</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Datos Generales</h3>
        {[
          {
            id: "ruc",
            label: "RUC/ID Fiscal",
            placeholder: "Ingrese el RUC o el ID fiscal",
            required: true,
          },
          {
            id: "nombre",
            label: "Nombre",
            placeholder: "Nombre del proveedor",
            required: true,
          },
          {
            id: "tipoProveedor",
            label: "Tipo de Proveedor",
            component: (
              <select
                id="tipoProveedor"
                {...register("tipoProveedor", { required: "Este campo es obligatorio" })}
                className="w-full bg-white border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Seleccione el tipo de proveedor
                </option>
                <option value="Local">Local</option>
                <option value="Extranjero">Extranjero</option>
              </select>
            ),
          },
          {
            id: "codigoPostal",
            label: "Código Postal",
            placeholder: "Ingrese el código postal",
          },
          {
            id: "paisProveedor",
            label: "País",
            placeholder: "País del proveedor",
          },
          {
            id: "ciudad",
            label: "Ciudad",
            placeholder: "Ciudad del proveedor",
          },
          {
            id: "distrito",
            label: "Distrito",
            placeholder: "Distrito del proveedor",
          },
          {
            id: "direccion",
            label: "Dirección",
            placeholder: "Dirección del proveedor",
          },
          {
            id: "rubro",
            label: "Rubro",
            placeholder: "Rubro de negocios",
          },
          {
            id: "tipoProducto",
            label: "Tipo de Productos",
            placeholder: "Productos que provee",
          },
        ].map(({ id, label, placeholder, required, component }) => (
          <div key={id} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={id} className="text-right col-span-1">
              {label}
            </Label>
            {component ? (
              <div className="col-span-3">{component}</div>
            ) : (
              <Input
                id={id}
                {...register(id, required && { required: "Este campo es obligatorio" })}
                className="col-span-3"
                placeholder={placeholder}
              />
            )}
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
            <Label htmlFor={id} className="text-right col-span-1">
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
      <div className="flex justify-end">
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

);
}