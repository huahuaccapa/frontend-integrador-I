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
import api from "@/api/axios";
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

export function TableDemo({ clientes, onClienteDeleted }) {
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

  const handleDelete = async (id) => {
    try {
      const confirmar = window.confirm("¿Estás seguro de eliminar este cliente?");
      if (!confirmar) return;
      
      await api.delete(`/clientes/${id}`);
      onClienteDeleted();
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
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
      <TableCaption>Lista de Clientes Registrados ({clientes.length})</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellidos</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>RUC/DNI</TableHead>
          {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.nombre || '-'}</TableCell>
            <TableCell>{cliente.apellidos || '-'}</TableCell>
            <TableCell>{cliente.email || '-'}</TableCell>
            <TableCell>{cliente.telefono || '-'}</TableCell>
            <TableCell>{cliente.identificacion || '-'}</TableCell>
            {isAdmin && (
              <TableCell className="text-right">
                <EditClienteDialog 
                  cliente={cliente} 
                  onClienteUpdated={onClienteDeleted} 
                />
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(cliente.id)}
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

function EditClienteDialog({ cliente, onClienteUpdated }) {
  const { register, handleSubmit,  formState: { errors } } = useForm({
    defaultValues: {
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      email: cliente.email,
      telefono: cliente.telefono,
      identificacion: cliente.identificacion
    }
  });

  const onSubmit = async (data) => {
    try {
      console.log("Actualizando cliente:", data);
      const response = await api.put(`/clientes/${cliente.id}`, {
        nombre: data.nombre,
        apellidos: data.apellidos || "",
        email: data.email,
        telefono: data.telefono || "",
        identificacion: data.identificacion || ""
      });

      if (response.status === 200) {
        toast({
          title: "Éxito",
          description: "Cliente actualizado correctamente",
          variant: "default",
        });
        onClienteUpdated();
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Campo Nombre */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Nombre*
            </Label>
            <Input
              id="nombre"
              {...register('nombre', { required: "Este campo es obligatorio" })}
              className="col-span-3"
            />
            {errors.nombre && (
              <span className="col-span-4 text-right text-sm text-red-500">
                {errors.nombre.message}
              </span>
            )}
          </div>

          {/* Campo Apellidos */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apellidos" className="text-right">
              Apellidos
            </Label>
            <Input
              id="apellidos"
              {...register('apellidos')}
              className="col-span-3"
            />
          </div>
          
          {/* Campo Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingrese un email válido"
                }
              })}
              className="col-span-3"
            />
            {errors.email && (
              <span className="col-span-4 text-right text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          
          {/* Campo Teléfono */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Teléfono
            </Label>
            <Input
              id="telefono"
              type="tel"
              {...register('telefono')}
              className="col-span-3"
            />
          </div>

          {/* Campo RUC/DNI */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="identificacion" className="text-right">
              RUC/DNI
            </Label>
            <Input
              id="identificacion"
              {...register('identificacion')}
              className="col-span-3"
            />
          </div>
          
          {/* Botón de Submit */}
          <div className="flex justify-end mt-4">
            <Button type="submit">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}