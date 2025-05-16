import React, { useEffect, useState } from "react";
import Services from "@/api/Services";
import { InventarioTable } from "./componentes/InventarioTable";
import { ProductoModal } from "./componentes/ProductoModal";
import { CardWithForm } from "./componentes/Modales/EditarModal";
import { VistaProducto } from "./componentes/Modales/VerProducto";
import { CrearProductoModal } from "./componentes/Modales/CrearProductoModal";

export function Inventario() {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalType, setModalType] = useState("");

  const cargarProductos = () => {
    Services.getAllProductos()
      .then((response) => {
        // Normalizar los datos aquí si es necesario
        const productosNormalizados = response.data.map(producto => ({
          ...producto,
          estado: producto.estadoStock || producto.estado || 'OPTIMO'
        }));
        setProductos(productosNormalizados);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleCrearProducto = (nuevoProducto) => {
    if (!nuevoProducto) {
      setModalType("");
      return;
    }
    
    Services.crearProducto({
      ...nuevoProducto,
      estadoStock: nuevoProducto.estado // Asegurar consistencia en el nombre
    })
      .then(() => {
        cargarProductos();
        setModalType("");
      })
      .catch((error) => {
        console.error("Error al crear producto:", error);
        alert("No se pudo crear el producto.");
      });
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>

      <InventarioTable
        data={productos}
        onVer={(producto) => {
          setSelectedProducto(producto);
          setModalType("ver");
        }}
        onEditar={(producto) => {
          setSelectedProducto(producto);
          setModalType("editar");
        }}
        onEliminar={(producto) => {
          if (
            confirm(
              `¿Seguro que deseas eliminar "${producto.nombreProducto || producto.producto}"?`
            )
          ) {
            Services.eliminarProducto(producto.id).then(() => {
              cargarProductos();
            });
          }
        }}
        onCrear={() => setModalType("crear")}
      />

      {/* Modal para ver, editar */}
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
              : modalType === "editar"
              ? "Editar Producto"
              : ""
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
                  estadoStock: productoEditado.estado // Mantener consistencia
                })
                  .then(() => {
                    cargarProductos();
                    setModalType("");
                    setSelectedProducto(null);
                  })
                  .catch(() => {
                    alert("No se pudo guardar los cambios.");
                  });
              }}
            />
          )}
        </ProductoModal>
      )}

      {/* Modal para crear nuevo producto */}
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