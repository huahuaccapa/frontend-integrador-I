import React, { useEffect, useState } from "react";
import Services from "@/api/services"; // Asegúrate que esta ruta sea correcta

import { InventarioTable } from "./componentes/InventarioTable";
import { ProductoModal } from "./componentes/ProductoModal";
import { CardWithForm } from "./componentes/Modales/EditarModal";
import { VistaProducto } from "./componentes/Modales/VerProducto";

export function Inventario() {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalType, setModalType] = useState(""); // "ver", "editar", "eliminar"

  // Función para cargar productos del backend
  const cargarProductos = () => {
    Services.getAllProductos()
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

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
            Services.eliminarProducto(producto.id)
              .then(() => {
                cargarProductos(); // Recargar después de eliminar
              })
              .catch((err) => {
                console.error("Error al eliminar:", err);
                alert("No se pudo eliminar el producto.");
              });
          }
        }}
      />

      {selectedProducto && (
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
          {modalType === "ver" && (
            <VistaProducto producto={selectedProducto} />
          )}

          {modalType === "editar" && (
            <CardWithForm
              producto={selectedProducto}
              onGuardar={async (productoEditado) => {
                try {
                  await Services.actualizarProducto(
                    selectedProducto.id,
                    productoEditado
                  );
                  cargarProductos();
                  setModalType("");
                  setSelectedProducto(null);
                } catch (error) {
                  console.error("Error al editar producto:", error);
                  alert("Error al guardar los cambios.");
                }
              }}
            />
          )}
        </ProductoModal>
      )}
    </div>
  );
}
