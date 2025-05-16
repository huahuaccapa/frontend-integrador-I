//src\pages\panels\Administrador\Inventario\componentes\Modales\ContenidoModal.jsx
import React from "react"

export function ContenidoProductoModal({ producto, tipo }) {
  return (
    <div className="space-y-2">
      <p><strong>ID:</strong> {producto.id}</p>
      <p><strong>Producto:</strong> {producto.producto}</p>
      <p><strong>Precio:</strong> {producto.precio}</p>
      <p><strong>Stock:</strong> {producto.stock}</p>
      <p><strong>Estado:</strong> {producto.estado}</p>

      {tipo === "eliminar" && (
        <p className="text-red-600">¿Estás seguro de que quieres eliminar este producto?</p>
      )}
    </div>
  )
}
