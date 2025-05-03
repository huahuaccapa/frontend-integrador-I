import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../../../../../api/axios"; 

export function FormCliente({ onSuccess }) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/clientes', {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre" className="text-right">
          Nombre
        </Label>
        <Input
          id="nombre"
          {...register('nombre', { required: true })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email', { required: true })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="telefono" className="text-right">
          Teléfono
        </Label>
        <Input
          id="telefono"
          {...register('telefono')}
          className="col-span-3"
        />
      </div>
      <Button type="submit" className="mt-4">
        Guardar Cliente
      </Button>
    </form>
  );
}