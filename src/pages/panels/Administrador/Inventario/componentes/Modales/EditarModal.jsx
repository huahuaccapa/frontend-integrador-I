import * as React from "react"
import { Separator } from "@/components/ui/separator"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CardWithForm({producto}) {
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Editar Producto</CardTitle>
        <CardDescription>Aqui podra modificar el producto</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Producto</Label>
              <Input id="name" defaultValue={producto.producto} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Precio</Label>
              <Input id="name" defaultValue={producto.precio} />
            </div>

            <Separator className="my-4" />
            <div className="flex flex-col space-y-1.5">

              <Label htmlFor="categoria">Categoria</Label>
              <Select>
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="estado">Estado</Label>
              <Select>
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancelar</Button>
        <Button>Guardar Cambios</Button>
      </CardFooter>
    </Card>
  )
}
