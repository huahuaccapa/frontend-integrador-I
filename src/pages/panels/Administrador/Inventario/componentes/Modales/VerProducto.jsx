import * as React from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Label } from "@/components/ui/label"

export function VistaProducto({ producto }) 
{

  return (

    <div className="space-y-2">
          <ResizablePanelGroup
            direction="horizontal"
            className="max-w-md rounded-lg border md:min-w-full"
          >
            <ResizablePanel defaultSize={50}>
              <div className="flex h-[200px] items-center justify-center p-6 ">
                <div className="p-4 rounded-xl">

                   <img src="https://marketinginsiderreview.com/wp-content/uploads/2022/10/accesorios-para-celulares.jpg"/>

                </div>
               
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={25}>
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Producto</span>
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
                        <Label className='mx-4'>{producto.precio}</Label>
                        <Label className='mx-4'>{producto.stock}</Label>
                        <Label className='mx-4'>{producto.estado}</Label>
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
