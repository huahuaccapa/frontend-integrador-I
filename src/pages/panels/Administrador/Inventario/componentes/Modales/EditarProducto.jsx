import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Trash2, Upload, ImagePlus } from "lucide-react"
import {Sheet,SheetClose,SheetContent,SheetFooter,SheetHeader,SheetTitle,SheetTrigger} from "@/components/ui/sheet"
import {Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function EditarProducto({open, onOpenChange}){
     const [images, setImages] = useState([])
    
      const handleAddImage = (e) => {
        const file = e.target.files[0]
        if (!file) return
    
        const reader = new FileReader()
        reader.onloadend = () => {
          setImages([...images, reader.result])
        }
        reader.readAsDataURL(file)
      }
    
      const handleDelete = (index) => {
        const updated = [...images]
        updated.splice(index, 1)
        setImages(updated)
      }
    return(
        <div className="p-4">
         <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-2 bg-green-800" >
                <SheetHeader>
                <SheetTitle className='font-semibond text-2xl text-white'>Editar Producto</SheetTitle>
                <Separator/>
                </SheetHeader>
                    <div className="grid gap-4">
                         <div className="">
                            <Label htmlFor="name" className="text-right text-white">
                            Imagenes:
                            </Label>                          
                            {/* Miniaturas + botón de agregar */}
                            <div className="flex flex-wrap gap-4">
                                {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow bg-white">
                                    <img src={img} alt={`img-${idx}`} className="object-cover w-full h-full" />
                                    <div className="absolute top-1 right-1 flex space-x-1">
                                    <button className="bg-white p-0.5 rounded hover:bg-gray-100">
                                        <Upload size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(idx)} className="bg-white p-0.5 rounded hover:bg-gray-100">
                                        <Trash2 size={14} />
                                    </button>
                                    </div>
                                </div>
                                ))}

                                {/* Botón Agregar Imagen */}
                               <label className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-green-300 transition">
                                <ImagePlus size={20} />
                                <span className="text-xs text-center mt-1">Agregar imagen</span>
                                <input type="file" onChange={handleAddImage} className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-white">
                            Codigo:
                            </Label>
                            <Input id="codigo" className="col-span-3 bg-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="producto" className="text-right text-white">
                            Producto:
                            </Label>
                            <Input id="producto" className="col-span-3 bg-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="categoria" className="text-right text-white">
                            Categoria:
                            </Label>
                           <Select>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccione una Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Categorias</SelectLabel>
                                    <SelectItem value="accesorios">Accesorios</SelectItem>
                                    <SelectItem value="repuestos">Repuestos</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <div>
                            <Label className="text-right text-white"> Stock:</Label>
                                <Input className="col-span-3 bg-white" />
                            </div>
                            <div>
                            <Label className="text-right text-white"> Min:</Label>
                                <Input className="col-span-3 bg-white" />
                            </div>
                            <div>
                            <Label className="text-right text-white"> Max:</Label>
                                <Input className="col-span-3 bg-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="categoria" className="text-right text-white">
                            Precio de Compra:
                            </Label>
                            <Input id="categoria" className="col-span-3 bg-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="categoria" className="text-right text-white">
                            Precio de Venta:
                            </Label>
                            <Input id="categoria" className="col-span-3 bg-white" />
                        </div>
                    </div>
                <SheetFooter>
                <SheetClose asChild>
                    <Button type="submit"  onClick={() => {
                        const confirmCancel = window.confirm("¿Estás seguro de guardar los cambios?");
                        if (confirmCancel) {
                            onOpenChange(true); // Cierra el modal
                        }
                        }}
                    >Guardar</Button>
                    
                </SheetClose>
                </SheetFooter>
            </SheetContent>
            </Sheet>
        </div>
    )
}