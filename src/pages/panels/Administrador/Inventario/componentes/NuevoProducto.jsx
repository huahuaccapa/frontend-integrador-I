import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Trash2, Upload, ImagePlus } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function Producto() {
    const [date, setDate] = React.useState()
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
  return (
    <div>
       <div>
            <p className='text-2xl font-semibold text-gray-800 mb-2'>Datos del Producto</p>
        </div>
        <Separator className='my-2'/>
        <div className='grid grid-cols-2'>
            {/* PRIMER PANEL */}
            <div className='grid grid-cols-2 bg-emerald-400 rounded-lg w-full '>
            {/*PRIMERA COLUMNA */}
                <div className='p-4'>
                    {/* NOMBRE DEL PRODUCTO */}
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Nombre del Producto</label>
                        <div className='m-2 border-black bg-white rounded-lg'>
                            <Input
                            type="text"
                            placeholder="Ingrese el nombre del Producto"
                            />
                        </div>
                    </div>
                    {/* CATEGORIA DEL PRODUCTO */}
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Categoria</label>
                        <Select>
                            <SelectTrigger className="p-2 m-2 w-full">
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
                        <Button>Agregar Categoria</Button>
                    </div>
                    {/* PRECIO DEL PRODUCTO */}
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Precio del Producto</label>
                        <div className='sm:col-span-3 grid grid-cols-2'>
                            
                            <div className='m-2 border-black bg-white rounded-lg'>
                                <Input
                                type="text"
                                placeholder="Precio de Compra"
                                />
                            </div>
                            <div className='m-2 border-black bg-white rounded-lg'>
                                <Input
                                type="text"
                                placeholder="Precio de Venta"
                                />
                            </div>
                        </div>
                    </div>
                    {/*CANTIDAD DEL PRODUCTO */}
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Cantidad del Producto</label>
                        <div className='m-2 border-black bg-white rounded-lg'>
                            <Input
                            type="number"
                            placeholder="Ingrese la cantidad del Producto"
                            />
                        </div>
                    </div>
                    {/*Descripción DEL PRODUCTO */}
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Descripcion</label>
                        <div className='m-2 border-black bg-white rounded-lg'>
                            <Textarea
                            placeholder="Ingrese una descripción del Producto"
                            />
                        </div>
                    </div>
                    {/*Fecha de Adquisición DEL PRODUCTO */}
                    <div className='sm:col-span-full'>
                        <label className='p-2 font-bold'>Fecha de Adquisición</label>
                        <div className='m-2 border-black bg-white rounded-lg'>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                {/* SEGUNDA COLUMNA */}
                <div className='p-4'>
                    {/* Codigo DEL PRODUCTO */}
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Codigo del Producto</label>
                        <div className='m-2 border-black bg-white rounded-lg'>
                            <Input
                            type="text"
                            placeholder="Ingrese el codigo del Producto"
                            />
                        </div>
                    </div>
                    {/* Stock DEL PRODUCTO */}
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Stock Minimo</label>
                        <div className='m-2 border-black bg-white rounded-lg'>
                            <Input
                            type="number"
                            placeholder="Ingrese Stock Minimo"
                            />
                        </div>
                    </div>
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Stock Maximo</label>
                        <div className='m-2 border-black bg-white rounded-lg'>
                            <Input
                            type="number"
                            placeholder="Ingrese el stock maximo"
                            />
                        </div>
                    </div>
                    {/*Marca del Producto */}
                    <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Marca</label>
                        <div className='m-2 border-black bg-white rounded-lg'>
                            <Input
                            type="text"
                            placeholder="Ingrese la marca"
                            />
                        </div>
                    </div>
                     <div className='sm:col-span-4'>
                        <label className='p-2 font-bold'>Estado</label>
                        <Select>
                            <SelectTrigger className="p-2 m-2 w-full">
                                <SelectValue placeholder="Seleccione una Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Estado</SelectLabel>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                       
                    </div>
                    {/*Boton de Guardar */}
                    <Button className='bg-black text-white my-10'>Guardar</Button>
                </div>
            </div>
            {/*SEGUNDO PANEL -- IMAGENES */}
           <div className="w-2/3 max-w-md mx-auto bg-emerald-400 rounded-2xl p-4 shadow-md space-y-4">
                {/* Imagen principal */}
                {images[0] && (
                    <div className="w-full aspect-square rounded-xl overflow-hidden relative">
                    <img
                        src={images[0]}
                        alt="Imagen principal"
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                        <button className="bg-white p-1 rounded-md shadow hover:bg-gray-100">
                        <Upload size={16} />
                        </button>
                        <button onClick={() => handleDelete(0)} className="bg-white p-1 rounded-md shadow hover:bg-gray-100">
                        <Trash2 size={16} />
                        </button>
                    </div>
                    </div>
                )}

                {/* Título */}
                <h2 className="text-lg font-semibold">Imágenes Adicionales</h2>

                {/* Miniaturas + botón de agregar */}
                <div className="flex flex-wrap gap-4">
                    {images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative size-24 rounded-xl overflow-hidden shadow bg-white">
                        <img src={img} alt={`img-${idx}`} className="object-cover w-full h-full" />
                        <div className="absolute top-1 right-1 flex space-x-1">
                        <button className="bg-white p-0.5 rounded hover:bg-gray-100">
                            <Upload size={14} />
                        </button>
                        <button onClick={() => handleDelete(idx + 1)} className="bg-white p-0.5 rounded hover:bg-gray-100">
                            <Trash2 size={14} />
                        </button>
                        </div>
                    </div>
                    ))}

                    {/* Botón Agregar Imagen */}
                    <label className="size-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-300 transition">
                    <ImagePlus size={20} />
                    <span className="text-xs text-center mt-1">Agregar imagen</span>
                    <input type="file" onChange={handleAddImage} className="hidden" />
                    </label>
                </div>
            </div>
            
        </div>
    </div>      
     
  )
}
