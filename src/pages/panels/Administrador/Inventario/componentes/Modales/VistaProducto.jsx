import React from "react";
import { Badge } from "@/components/ui/badge";

export function VistaProducto({ producto }) {
  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'OPTIMO': return 'bg-green-100 text-green-800';
      case 'MEDIO': return 'bg-yellow-100 text-yellow-800';
      case 'BAJO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio || 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">ID</p>
          <p className="font-medium">{producto.id || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Tipo</p>
          <p className="font-medium capitalize">
            {producto.tipoProducto?.toLowerCase() || 'N/A'}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">Nombre del Producto</p>
        <p className="font-medium">
          {producto.nombreProducto || producto.producto || 'N/A'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Precio</p>
          <p className="font-medium">
            {formatPrecio(producto.precio)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Stock</p>
          <p className={`font-medium ${
            producto.stock <= 5 ? 'text-red-600' : 'text-green-600'
          }`}>
            {producto.stock || '0'}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">Estado del Stock</p>
        <Badge className={getEstadoColor(producto.estadoStock || producto.estado)}>
          {producto.estadoStock || producto.estado || 'N/A'}
        </Badge>
      </div>
    </div>
  );
}