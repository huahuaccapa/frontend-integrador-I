import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"

export function ProcesoVenta(){
    return (
        <div>
            <h1 className="font-semibold text-xl">DETALLE DE VENTA</h1>
            <Separator/>
            <div className="my-4">
                <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                    <CommandInput placeholder="Ingrese el Nombre de un Cliente..." />
                    <CommandList>
                        <CommandEmpty>Cliente no encontrado.</CommandEmpty>
                    </CommandList>
                    </Command>
            </div>

        </div>
    )
}