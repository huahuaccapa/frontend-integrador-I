//src\pages\panels\Administrador\Inventario\inventario.jsx
import React, { useEffect, useState } from "react";
import Services from "@/api/Services";
import { InventarioTable } from "./componentes/InventarioTable";
import { ProductoModal } from "./componentes/ProductoModal";
import { EditarProducto } from "./componentes/Modales/EditarProducto";
import { VistaProducto } from "./componentes/Modales/VerProducto";
import { useToast } from "@/components/ui/use-toast";
import { Package, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"; // Agregado: Toaster local

export function Inventario() {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalType, setModalType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const cargarProductos = () => {
    setIsLoading(true);
    Services.getAllProductos()
      .then((response) => {
        const productosNormalizados = response.data.map(producto => ({
          ...producto,
          estado: producto.estadoStock || producto.estado || 'OPTIMO'
        }));
        setProductos(productosNormalizados);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // MEJORADO: Función separada para manejar eliminación con mejor manejo de errores
  const handleEliminarProducto = async (producto) => {
    const nombreProducto = producto.nombreProducto || producto.producto;
    
    if (!confirm(`¿Seguro que deseas eliminar "${nombreProducto}"?`)) {
      return;
    }

    try {
      await Services.eliminarProducto(producto.id);
      // Si llegamos aquí, la eliminación fue exitosa
      cargarProductos();
      toast({
        title: "Producto eliminado",
        description: `"${nombreProducto}" fue eliminado correctamente`,
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      
      // Mejor manejo del mensaje de error basado en la respuesta del servidor
      const mensajeError = error.response?.status === 500 
        ? "No se pudo eliminar el producto porque está asociado con la venta de un cliente existente"
        : error.response?.data || "Error al eliminar el producto";
      
      toast({
        title: "Error",
        description: mensajeError,
        variant: "destructive",
      });
    }
  };

  const handleCrearProducto = (nuevoProducto) => {
    if (!nuevoProducto) {
      setModalType("");
      return;
    }

    if (!nuevoProducto.nombreProducto?.trim() || 
        isNaN(nuevoProducto.precio) || 
        isNaN(nuevoProducto.stock)) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    Services.crearProducto({
      ...nuevoProducto,
      estadoStock: nuevoProducto.estado
    })
      .then(() => {
        cargarProductos();
        setModalType("");
        toast({
          title: "Producto creado",
          description: `${nuevoProducto.nombreProducto} ha sido registrado exitosamente`,
        });
      })
      .catch((error) => {
        console.error("Error al crear producto:", error);
        toast({
          title: "Error",
          description: "No se pudo crear el producto",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        </div>
        <Button onClick={() => navigate("/dashboard/inventario/crearproducto")} className="gap-2">
          {/* Este btn te lleva a crear */}
          <PlusCircle className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4">
        <InventarioTable
          data={productos}
          isLoading={isLoading}
          onVer={(producto) => {
            setSelectedProducto(producto);
            setModalType("ver");
          }}
          onEditar={(producto) => {
            setSelectedProducto(producto);
            setModalType("editar");
          }}
          onEliminar={handleEliminarProducto} // CAMBIADO: Usar la función mejorada
        />
      </div>

      {modalType === "ver" && selectedProducto && (
        <ProductoModal
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setModalType("");
              setSelectedProducto(null);
            }
          }}
          title="Detalles del Producto"
        >
          <VistaProducto producto={selectedProducto} />
        </ProductoModal>
      )}

      {modalType === "editar" && selectedProducto && (
        <EditarProducto
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setModalType("");
              setSelectedProducto(null);
            }
          }}
          producto={selectedProducto}
          onGuardar={(productoEditado) => {
            if (!productoEditado) {
              setModalType("");
              return;
            }

            Services.actualizarProducto(selectedProducto.id, {
              ...productoEditado,
              estadoStock: productoEditado.estado
            })
              .then(() => {
                cargarProductos();
                toast({
                  title: "Cambios guardados",
                  description: `"${productoEditado.nombreProducto}" fue actualizado correctamente`,
                });
                setModalType("");
                setSelectedProducto(null);
              })
              .catch(() => {
                toast({
                  title: "Error",
                  description: "No se pudieron guardar los cambios",
                  variant: "destructive",
                });
              });
          }}
        />
      )}

      {/* AGREGADO: Toaster local para este componente */}
      <Toaster />
    </div>
  );
}