import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/axios";
import { toast } from "@/components/ui/use-toast";

export function FormCliente({ onSuccess, cliente, isEdit = false }) {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: cliente || {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      identificacion: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      console.log("Enviando datos:", data);
      
      const clienteData = {
        nombre: data.nombre.trim(),
        apellidos: data.apellidos?.trim() || "",
        email: data.email.trim(),
        telefono: data.telefono?.trim() || "",
        identificacion: data.identificacion?.trim() || ""
      };

      let response;
      
      if (isEdit && cliente?.id) {
        response = await api.put(`/clientes/${cliente.id}`, clienteData);
      } else {
        response = await api.post('/clientes', clienteData);
      }

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Éxito",
          description: isEdit 
            ? "Cliente actualizado correctamente" 
            : "Cliente registrado correctamente",
          variant: "default",
        });
        reset();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error al procesar cliente:", error);
      
      let errorMessage = error.response?.data || error.message;
      
      // Manejo específico de errores
      if (error.response?.status === 409) {
        errorMessage = "Ya existe un cliente con este email";
      } else if (error.response?.status === 400) {
        errorMessage = "Datos inválidos enviados";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      {/* Campo Nombre */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre" className="text-right">
          Nombre*
        </Label>
        <Input
          id="nombre"
          {...register('nombre', { 
            required: "Este campo es obligatorio",
            minLength: {
              value: 2,
              message: "El nombre debe tener al menos 2 caracteres"
            },
            maxLength: {
              value: 100,
              message: "El nombre no puede exceder los 100 caracteres"
            }
          })}
          className="col-span-3"
          placeholder="Ingrese el nombre completo"
          disabled={isSubmitting}
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
          {...register('apellidos', {
            maxLength: {
              value: 100,
              message: "Los apellidos no pueden exceder los 100 caracteres"
            }
          })}
          className="col-span-3"
          placeholder="Ingrese los apellidos"
          disabled={isSubmitting}
        />
        {errors.apellidos && (
          <span className="col-span-4 text-right text-sm text-red-500">
            {errors.apellidos.message}
          </span>
        )}
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
            },
            maxLength: {
              value: 100,
              message: "El email no puede exceder los 100 caracteres"
            }
          })}
          className="col-span-3"
          placeholder="ejemplo@correo.com"
          disabled={isSubmitting}
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
          {...register('telefono', {
            pattern: {
              value: /^[0-9+\- ]*$/,
              message: "Ingrese un número de teléfono válido"
            },
            maxLength: {
              value: 20,
              message: "El teléfono no puede exceder los 20 caracteres"
            }
          })}
          className="col-span-3"
          placeholder="Ej: +51 987654321"
          disabled={isSubmitting}
        />
        {errors.telefono && (
          <span className="col-span-4 text-right text-sm text-red-500">
            {errors.telefono.message}
          </span>
        )}
      </div>

      {/* Campo Identificación */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="identificacion" className="text-right">
          RUC/DNI
        </Label>
        <Input
          id="identificacion"
          {...register('identificacion', {
            maxLength: {
              value: 20,
              message: "La identificación no puede exceder los 20 caracteres"
            }
          })}
          className="col-span-3"
          placeholder="Ingrese RUC o DNI"
          disabled={isSubmitting}
        />
        {errors.identificacion && (
          <span className="col-span-4 text-right text-sm text-red-500">
            {errors.identificacion.message}
          </span>
        )}
      </div>
      
      {/* Botón de Submit */}
      <div className="flex justify-end mt-4">
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : isEdit ? (
            "Actualizar Cliente"
          ) : (
            "Registrar Cliente"
          )}
        </Button>
      </div>
    </form>
  );
}