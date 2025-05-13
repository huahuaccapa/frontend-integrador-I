export function VistaProducto({ producto }) {
  return (
    <div className="space-y-2">
      <p><strong>ID:</strong> {producto.id}</p>
      <p><strong>Producto:</strong> {producto.producto}</p>
      <p><strong>Precio:</strong> {producto.precio}</p>
      <p><strong>Stock:</strong> {producto.stock}</p>
      <p><strong>Estado:</strong> {producto.estado}</p>
    </div>
  )
}
