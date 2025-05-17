import React, { useEffect, useState } from "react";
import Services from "@/api/Services";
import { InventarioTable } from "./componentes/InventarioTable";
import { ProductoModal } from "./componentes/ProductoModal";
import { CardWithForm } from "./componentes/Modales/EditarModal";
import { VistaProducto } from "./componentes/Modales/VerProducto";
import { CrearProductoModal } from "./componentes/Modales/CrearProductoModal";
import { useToast } from "@/components/ui/use-toast";
import { Package, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Inventario() {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalType, setModalType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
        <Button onClick={() => setModalType("crear")} className="gap-2">
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
          onEliminar={(producto) => {
            if (confirm(`¿Seguro que deseas eliminar "${producto.nombreProducto || producto.producto}"?`)) {
              Services.eliminarProducto(producto.id).then(() => {
                cargarProductos();
                toast({
                  title: "Producto eliminado",
                  description: `"${producto.nombreProducto || producto.producto}" fue eliminado correctamente`,
                });
              }).catch(() => {
                toast({
                  title: "Error",
                  description: "No se pudo eliminar el producto",
                  variant: "destructive",
                });
              });
            }
          }}
          onCrear={() => setModalType("crear")}
        />
      </div>

      {selectedProducto && modalType !== "crear" && (
        <ProductoModal
          open={!!modalType}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedProducto(null);
              setModalType("");
            }
          }}
          title={
            modalType === "ver" 
              ? "Detalles del Producto" 
              : "Editar Producto"
          }
        >
          {modalType === "ver" && <VistaProducto producto={selectedProducto} />}
          {modalType === "editar" && (
            <CardWithForm
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
                    setModalType("");
                    setSelectedProducto(null);
                    toast({
                      title: "Cambios guardados",
                      description: `"${productoEditado.nombreProducto}" fue actualizado correctamente`,
                    });
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
        </ProductoModal>
      )}

      {modalType === "crear" && (
        <ProductoModal
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setModalType("");
            }
          }}
          title="Agregar Nuevo Producto"
        >
          <CrearProductoModal onGuardar={handleCrearProducto} />
        </ProductoModal>
      )}
    </div>
  );
}