//src\pages\panels\Administrador\Cliente\Components\FormCliente.jsx
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

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
      direccion: '',
      email: '',
      telefono: '',
      identificacion: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const clienteData = {
        nombre: data.nombre.trim(),
        apellidos: data.apellidos?.trim() || "",
        direccion: data.direccion?.trim() || "",
        email: data.email.trim(),
        telefono: data.telefono?.trim() || "",
        identificacion: data.identificacion?.trim() || ""
      };

      let response;
      const url = isEdit && cliente?.id 
        ? `https://multiservicios-85dff762daa1.herokuapp.com/api/clientes/${cliente.id}`
        : 'https://multiservicios-85dff762daa1.herokuapp.com/api/clientes';
      
      const method = isEdit ? 'put' : 'post';
      
    
      response = await axios[method](url, clienteData);

      toast({
        title: "Éxito",
        description: isEdit 
          ? "Cliente actualizado correctamente" 
          : "Cliente registrado correctamente",
        variant: "default",
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al procesar cliente:", error);
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="space-y-2">
         {/*Datos del cliente */}
          <div className="space-y-4">
            <h1 className="my-4 font-bold text-white">Datos del Cliente</h1>
            <Separator className='my-4'/>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right text-white">Nombre</Label>
              <Input
                id="nombre"
                {...register('nombre', { 
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres"
                  }
                })}
                className="col-span-3 bg-white"
                placeholder="Ingrese nombres"
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <span className="col-span-4 text-right text-sm text-red-500 font-bold">
                  {errors.nombre.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apellidos" className="text-right text-white">
                Apellidos
              </Label>
              <Input
                id="apellidos"
                {...register('apellidos')}
                className="col-span-3 bg-white"
                placeholder="Ingrese los apellidos"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right text-white">
                Dirección
              </Label>
              <Input
                id="direccion"
                {...register('direccion')}
                className="col-span-3 bg-white"
                placeholder="Ingrese la dirección"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="identificacion" className="text-right text-white">
                RUC/DNI
              </Label>
              <Input
                id="identificacion"
                {...register('identificacion')}
                className="col-span-3 bg-white"
                placeholder="Ingrese RUC o DNI"
                disabled={isSubmitting}
              />
            </div>
          </div>
          {/* DATOS DE CONTACTO */}
          <div className="space-y-4">
            <h1 className="my-4 font-bold text-white">Contacto</h1>
            <Separator className='my-4'/>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-white">
                  Email
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
                  className="col-span-3 bg-white"
                  placeholder="ejemplo@correo.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="col-span-4 text-right text-sm text-red-500 font-bold">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right text-white">
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                {...register('telefono')}
                className="col-span-3 bg-white"
                placeholder="Ej: +51 987654321"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
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
      </div>
    </form>
  );
}