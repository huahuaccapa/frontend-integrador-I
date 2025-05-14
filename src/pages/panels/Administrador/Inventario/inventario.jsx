import React, { useState } from "react";
import { data as initialData } from "./componentes/data";
import { InventarioTable } from "./componentes/InventarioTable";
import { ProductoModal } from "./componentes/ProductoModal";
import { CardWithForm } from "./componentes/Modales/EditarModal";
import { VistaProducto } from "./componentes/Modales/VerProducto";
import { NuevoProductoModal } from "./componentes/Modales/NuevoProductoModal"; // Modal para agregar productos

export function Inventario() {
  const [data, setData] = useState(initialData); // Lista de productos
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalType, setModalType] = useState(""); // "ver", "editar", "eliminar", "agregar"
  const [isAdding, setIsAdding] = useState(false); // Controla el modal de agregar

  // Manejar agregar nuevo producto
  const handleAddProduct = (nuevoProducto) => {
    setData((prevData) => [...prevData, nuevoProducto]); // Agregar nuevo producto a la lista
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>

      <InventarioTable
        data={data}
        onVer={(producto) => {
          setSelectedProducto(producto);
          setModalType("ver");
        }}
        onEditar={(producto) => {
          setSelectedProducto(producto);
          setModalType("editar");
        }}
        onEliminar={(producto) => {
          setSelectedProducto(producto);
          setModalType("eliminar");
        }}
        onAgregar={() => setIsAdding(true)}  // Agregar manejo de apertura del modal desde el botón en la tabla
      />

      {/* Modal para agregar producto */}
      <NuevoProductoModal
        open={isAdding}
        onOpenChange={setIsAdding}
        onSubmit={handleAddProduct}
      />

      {/* Modales para Ver/Editar/Eliminar */}
      {selectedProducto && (
        <ProductoModal
          open={!!modalType}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedProducto(null);
              setModalType("");
            }
          }}
        >
          {modalType === "ver" && <VistaProducto producto={selectedProducto} />}
          {modalType === "editar" && (
            <CardWithForm producto={selectedProducto} />
          )}
        </ProductoModal>
      )}
    </div>
  );
}
