import React from "react";

export function VistaProducto({ producto }) {
  // Función para formatear el estado
  const formatEstado = (estado) => {
    if (!estado) return 'N/A';
    const estados = {
      'OPTIMO': 'Óptimo',
      'MEDIO': 'Medio',
      'BAJO': 'Bajo'
    };
    return estados[estado] || estado;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">ID</p>
          <p className="font-semibold">{producto.id || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Tipo</p>
          <p className="font-semibold capitalize">
            {producto.tipoProducto?.toLowerCase() || 'N/A'}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Nombre del Producto</p>
        <p className="font-semibold">
          {producto.nombreProducto || producto.producto || 'N/A'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Precio</p>
          <p className="font-semibold">
            {producto.precio ? `$${producto.precio.toFixed(2)}` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Stock</p>
          <p className={`font-semibold ${
            producto.stock <= 5 ? 'text-red-600' : 'text-green-600'
          }`}>
            {producto.stock || '0'}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Estado del Stock</p>
        <p className="font-semibold">
          {formatEstado(producto.estadoStock || producto.estado)}
        </p>
      </div>
    </div>
  );
}