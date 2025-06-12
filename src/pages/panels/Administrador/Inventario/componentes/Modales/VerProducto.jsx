import * as React from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Label } from "@/components/ui/label"

export function VistaProducto({ producto }) {
  // Obtener la primera imagen del producto o usar cadena vacía si no hay
  const imagenPrincipal = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes[0] 
    : "";

  return (
    <div className="space-y-2">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border md:min-w-full"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <div className="p-4 rounded-xl">
              {imagenPrincipal ? (
                <img 
                  src={imagenPrincipal} 
                  alt={producto.nombreProducto || "Producto"} 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "";
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">{producto.nombreProducto || "Producto"}</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6 grid grid-rows-2">
                <div className="grid grid-cols-4 ">
                    <Label className='mx-4'>Precio</Label>
                    <Label className='mx-4'>Stock</Label>
                    <Label className='mx-4'>Estado</Label>
                    <Label className='mx-4'>Venta</Label>
                </div>
                <div className="grid grid-cols-4 m-3">
                    <Label className='mx-4'>{producto.precioVenta || "N/A"}</Label>
                    <Label className='mx-4'>{producto.stock || "N/A"}</Label>
                    <Label className='mx-4'>{producto.estado || "N/A"}</Label>
                    <Label className='mx-8'>120</Label>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
