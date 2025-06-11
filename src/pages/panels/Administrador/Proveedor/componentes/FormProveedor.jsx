//src\pages\panels\Administrador\Proveedor\componentes\FormProveedor.jsx
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import ServiceProveedores from "@/api/ServiceProveedores";

export function FormProveedor({ onSuccess, proveedor, isEdit = false }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
   defaultValues: {
     ...(proveedor || {}),
  ruc: proveedor?.ruc || "",
  tipoProveedor: proveedor?.tipoProveedor || "",
  nombre: proveedor?.nombre || "",
  codigoPostal: proveedor?.codigoPostal || "",
  paisProveedor: proveedor?.paisProveedor || "",
  ciudad: proveedor?.ciudad || "",
  distrito: proveedor?.distrito || "",
  direccion: proveedor?.direccion || "",
  rubro: proveedor?.rubro || "",
  tipoProducto: proveedor?.tipoProducto || "",
  telefono: proveedor?.telefono || "",
  correo: proveedor?.correo || "",
},

  });

  const onSubmit = async (data) => {
    try {
      if (!data.nombre) {
        throw new Error("El nombre es requerido");
      }

      const proveedorData = {
        ruc: data.ruc?.trim() || "",
        tipoProveedor: data.tipoProveedor?.trim() || "Local",
        nombre: data.nombre?.trim() || "",
        codigoPostal: data.codigoPostal?.trim() || "",
        paisProveedor: data.paisProveedor?.trim() || "",
        ciudad: data.ciudad?.trim() || "",
        distrito: data.distrito?.trim() || "",
        direccion: data.direccion?.trim() || "",
        rubro: data.rubro?.trim() || "",
        tipoProducto: data.tipoProducto?.trim() || "",
        telefono: data.telefono?.trim() || "",
        correo: data.correo?.trim() || "",
      };

      let response;
      if (isEdit && proveedor?.id) {
        response = await ServiceProveedores.updateProveedor(proveedor.id, proveedorData);
      } else {
        response = await ServiceProveedores.createProveedor(proveedorData);
      }

      toast({
        title: "Éxito",
        description: isEdit
          ? "Proveedor actualizado correctamente"
          : "Proveedor registrado correctamente",
        variant: "default",
      });
      
      reset();
      
      // Llama a onSuccess con los datos correctos
      if (onSuccess) {
        const successData = isEdit ? 
          { ...proveedorData, id: proveedor.id } : 
          (response?.data || proveedorData);
        onSuccess(successData);
      }
    } catch (error) {
      console.error("Error detallado:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Error desconocido",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="space-y-2">
          {/* Datos del Proveedor */}
          <div className="space-y-4">
            <h1 className="my-4 font-bold text-black">Datos del Proveedor</h1>
            <Separator className="my-4" />
            {[{
              id: "ruc",
              label: "RUC/ID Fiscal",
              placeholder: "Ingrese el RUC o el ID fiscal",
              required: true,
            },
            {
              id: "tipoProveedor",
              label: "Tipo",
              component: (
                <select
                  id="tipoProveedor"
                  {...register("tipoProveedor", { required: "Este campo es obligatorio" })}
                  className="col-span-3 bg-white border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
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
              id: "nombre",
              label: "Nombre",
              placeholder: "Nombre del proveedor",
              required: true,
            },
            {
              id: "codigoPostal",
              label: "Codigo Postal",
              placeholder: "Codigo Postal",
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
            }].map(({ id, label, placeholder, required, component }) => (
              <div className="grid grid-cols-4 items-center gap-4" key={id}>
                <Label htmlFor={id} className="text-right text-black">{label}</Label>
                {component ? (
                  component
                ) : (
                  <Input
                    id={id}
                    {...register(id, required && { required: "Este campo es obligatorio" })}
                    className="col-span-3 bg-white"
                    placeholder={placeholder}
                    disabled={isSubmitting}
                  />
                )}
                {errors[id] && (
                  <span className="col-span-4 text-right text-sm text-red-500 font-bold">
                    {errors[id].message}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h1 className="my-4 font-bold text-black">Contacto</h1>
            <Separator className="my-4" />
            {[{
              id: "telefono",
              label: "Teléfono",
              placeholder: "Ej: +51 987654321",
              required: true,
            },
            {
              id: "correo",
              label: "Correo",
              placeholder: "ejemplo@correo.com",
              required: true,
              validation: {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingrese un correo válido",
                },
              },
            }].map(({ id, label, placeholder, required, validation }) => (
              <div className="grid grid-cols-4 items-center gap-4" key={id}>
                <Label htmlFor={id} className="text-right text-black">{label}</Label>
                <Input
                  id={id}
                  type={id === "correo" ? "email" : "text"}
                  {...register(id, { ...(required && { required: "Este campo es obligatorio" }), ...validation })}
                  className="col-span-3 bg-white"
                  placeholder={placeholder}
                  disabled={isSubmitting}
                />
                {errors[id] && (
                  <span className="col-span-4 text-right text-sm text-red-500 font-bold">
                    {errors[id].message}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 flex justify-end mt-10 bg-gray-100 p-1">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </span>
              ) : isEdit ? (
                "Actualizar Proveedor"
              ) : (
                "Registrar Proveedor"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}