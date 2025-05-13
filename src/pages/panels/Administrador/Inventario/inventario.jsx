import React, { useState } from "react"
import { data } from "./componentes/data"
import { InventarioTable } from "./componentes/InventarioTable"
import { ProductoModal } from "./componentes/ProductoModal"
import { CardWithForm } from "./componentes/Modales/EditarModal"
import { VistaProducto } from "./componentes/Modales/VerProducto"

export function Inventario() {
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [modalType, setModalType] = useState("") // "ver", "editar", "eliminar"

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>

      <InventarioTable
        data={data}
        onVer={(producto) => {
          setSelectedProducto(producto)
          setModalType("ver")
        }}
        onEditar={(producto) => {
          setSelectedProducto(producto)
          setModalType("editar")
        }}
        onEliminar={(producto) => {
          setSelectedProducto(producto)
          setModalType("eliminar")
        }}
      />

      {selectedProducto && (
        <ProductoModal
          open={!!modalType}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedProducto(null)
              setModalType("")
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
  )
}
