import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { toast } from "@/components/ui/use-toast";

export function FormProveedor({ onSuccess, proveedor, isEdit = false }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: proveedor || {
      ruc: '',
      tipo: '',
      nombre: '',
      direccion: '',
      pais: '',
      region: '',
      distrito: '',
      rubro: '',
      tipoProductos: '',
      telefono: '',
      correo: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const proveedorData = {
        ruc: data.ruc.trim(),
        tipo: data.tipo.trim(),
        nombre: data.nombre.trim(),
        direccion: data.direccion.trim(),
        pais: data.pais.trim(),
        region: data.region.trim(),
        distrito: data.distrito.trim(),
        rubro: data.rubro.trim(),
        tipoProductos: data.tipoProductos.trim(),
        telefono: data.telefono.trim(),
        correo: data.correo.trim(),
      };

      const url = isEdit && proveedor?.id
        ? `http://localhost:8080/api/proveedores/${proveedor.id}`
        : 'http://localhost:8080/api/proveedores';

      const method = isEdit ? 'put' : 'post';

      await axios[method](url, proveedorData);

      toast({
        title: "Éxito",
        description: isEdit
          ? "Proveedor actualizado correctamente"
          : "Proveedor registrado correctamente",
        variant: "default",
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      {/* Campos para datos generales */}
      {[
        { id: "ruc", label: "RUC*", placeholder: "Ingrese el RUC", required: true },
        { id: "tipo", label: "Tipo", placeholder: "Tipo de proveedor" },
        { id: "nombre", label: "Nombre*", placeholder: "Nombre del proveedor", required: true },
        { id: "direccion", label: "Dirección", placeholder: "Dirección del proveedor" },
        { id: "pais", label: "País", placeholder: "País de origen" },
        { id: "region", label: "Región", placeholder: "Región del proveedor" },
        { id: "distrito", label: "Distrito", placeholder: "Distrito del proveedor" },
        { id: "rubro", label: "Rubro", placeholder: "Rubro de negocios" },
        { id: "tipoProductos", label: "Tipo de productos", placeholder: "Productos que provee" },
      ].map(({ id, label, placeholder, required }) => (
        <div className="grid grid-cols-4 items-center gap-4" key={id}>
          <Label htmlFor={id} className="text-right">{label}</Label>
          <Input
            id={id}
            {...register(id, required && { required: "Este campo es obligatorio" })}
            className="col-span-3"
            placeholder={placeholder}
            disabled={isSubmitting}
          />
          {errors[id] && (
            <span className="col-span-4 text-right text-sm text-red-500">
              {errors[id].message}
            </span>
          )}
        </div>
      ))}

      {/* Campos de contacto */}
      {[
        { id: "telefono", label: "Teléfono*", placeholder: "Ej: +51 987654321", required: true },
        {
          id: "correo",
          label: "Correo*",
          placeholder: "Ejemplo: proveedor@correo.com",
          required: true,
          validation: {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingrese un correo válido",
            },
          },
        },
      ].map(({ id, label, placeholder, required, validation }) => (
        <div className="grid grid-cols-4 items-center gap-4" key={id}>
          <Label htmlFor={id} className="text-right">{label}</Label>
          <Input
            id={id}
            type={id === "correo" ? "email" : "text"}
            {...register(id, { ...(required && { required: "Este campo es obligatorio" }), ...validation })}
            className="col-span-3"
            placeholder={placeholder}
            disabled={isSubmitting}
          />
          {errors[id] && (
            <span className="col-span-4 text-right text-sm text-red-500">
              {errors[id].message}
            </span>
          )}
        </div>
      ))}

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : isEdit ? "Actualizar Proveedor" : "Registrar Proveedor"}
        </Button>
      </div>
    </form>
  );
}