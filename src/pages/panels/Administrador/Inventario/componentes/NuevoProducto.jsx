import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Trash2, Upload, ImagePlus, CalendarIcon } from "lucide-react"
import axios from "axios"

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:8080/api/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url; // Ejemplo: http://localhost:8080/uploads/filename.jpg
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return null;
  }
};

export function Producto() {
  const [date, setDate] = useState()
  const [images, setImages] = useState([])
  const [urlInput, setUrlInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const [producto, setProducto] = useState({
    nombreProducto: "",
    categoria: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    stockMinimo: "",
    stockMaximo: "",
    marca: "",
    estado: "",
    descripcion: "",
    codigo: "",
    fechaAdquisicion: "",
    imagenes: [],
  })

  useEffect(() => {
    setProducto(prev => ({ ...prev, imagenes: images }))
  }, [images])

  useEffect(() => {
    setProducto(prev => ({ ...prev, fechaAdquisicion: date }))
  }, [date])

  const handleAddUrlImage = () => {
    if (urlInput.trim() !== "") {
      setImages(prev => [...prev, urlInput.trim()])
      setUrlInput("")
    }
  }

  const handleDelete = (index) => {
    const updated = [...images]
    updated.splice(index, 1)
    setImages(updated)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setImages(prev => [...prev, imageUrl]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (date) => {
    return date?.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }

  const handleGuardarProducto = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/productos", {
        ...producto,
        fechaAdquisicion: formatDate(date),
      });
      console.log("Producto guardado", response.data);
      window.alert("✅ Producto creado exitosamente!");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      window.alert("❌ Error al crear el producto");
    }
  };

  return (
    <div>
      <div>
        <p className='text-2xl font-semibold text-gray-800 mb-2'>Datos del Producto</p>
      </div>
      <Separator className='my-2' />
      <div className='grid grid-cols-2'>
        {/* PANEL DE CAMPOS */}
        <div className='grid grid-cols-2 bg-emerald-400 rounded-lg w-full'>
          {/* PRIMERA COLUMNA */}
          <div className='p-4'>
            {/* Nombre */}
            <label className='p-2 font-bold'>Nombre del Producto</label>
            <div className='m-2 bg-white rounded-lg'>
              <Input
                type="text"
                placeholder="Ingrese el nombre del Producto"
                value={producto.nombreProducto}
                onChange={(e) => setProducto({ ...producto, nombreProducto: e.target.value })}
              />
            </div>

            {/* Categoría */}
            <label className='p-2 font-bold'>Categoría</label>
            <Select onValueChange={(val) => setProducto({ ...producto, categoria: val })}>
              <SelectTrigger className="p-2 m-2 w-full">
                <SelectValue placeholder="Seleccione una Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categorías</SelectLabel>
                  <SelectItem value="accesorios">Accesorios</SelectItem>
                  <SelectItem value="repuestos">Repuestos</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Precios */}
            <label className='p-2 font-bold'>Precio del Producto</label>
            <div className='grid grid-cols-2'>
              <div className='m-2 bg-white rounded-lg'>
                <Input
                  type="text"
                  placeholder="Precio de Compra"
                  value={producto.precioCompra}
                  onChange={(e) => setProducto({ ...producto, precioCompra: e.target.value })}
                />
              </div>
              <div className='m-2 bg-white rounded-lg'>
                <Input
                  type="text"
                  placeholder="Precio de Venta"
                  value={producto.precioVenta}
                  onChange={(e) => setProducto({ ...producto, precioVenta: e.target.value })}
                />
              </div>
            </div>

            {/* Stock */}
            <label className='p-2 font-bold'>Cantidad del Producto</label>
            <div className='m-2 bg-white rounded-lg'>
              <Input
                type="number"
                placeholder="Ingrese la cantidad del Producto"
                value={producto.stock}
                onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
              />
            </div>

            {/* Descripción */}
            <label className='p-2 font-bold'>Descripción</label>
            <div className='m-2 bg-white rounded-lg'>
              <Textarea
                placeholder="Ingrese una descripción del Producto"
                value={producto.descripcion}
                onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
              />
            </div>

            {/* Fecha */}
            <label className='p-2 font-bold'>Fecha de Adquisición</label>
            <div className='m-2 bg-white rounded-lg'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-[240px] justify-start text-left", !date && "text-muted-foreground")}>
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Seleccione una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* SEGUNDA COLUMNA */}
          <div className='p-4'>
            <label className='p-2 font-bold'>Código del Producto</label>
            <div className='m-2 bg-white rounded-lg'>
              <Input
                type="text"
                placeholder="Ingrese el código del Producto"
                value={producto.codigo}
                onChange={(e) => setProducto({ ...producto, codigo: e.target.value })}
              />
            </div>

            <label className='p-2 font-bold'>Stock Mínimo</label>
            <div className='m-2 bg-white rounded-lg'>
              <Input
                type="number"
                placeholder="Ingrese Stock Mínimo"
                value={producto.stockMinimo}
                onChange={(e) => setProducto({ ...producto, stockMinimo: e.target.value })}
              />
            </div>

            <label className='p-2 font-bold'>Stock Máximo</label>
            <div className='m-2 bg-white rounded-lg'>
              <Input
                type="number"
                placeholder="Ingrese Stock Máximo"
                value={producto.stockMaximo}
                onChange={(e) => setProducto({ ...producto, stockMaximo: e.target.value })}
              />
            </div>

            <label className='p-2 font-bold'>Marca</label>
            <div className='m-2 bg-white rounded-lg'>
              <Input
                type="text"
                placeholder="Ingrese la marca"
                value={producto.marca}
                onChange={(e) => setProducto({ ...producto, marca: e.target.value })}
              />
            </div>

            <label className='p-2 font-bold'>Estado</label>
            <Select onValueChange={(val) => setProducto({ ...producto, estado: val })}>
              <SelectTrigger className="p-2 m-2 w-full">
                <SelectValue placeholder="Seleccione un Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estado</SelectLabel>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button onClick={handleGuardarProducto} className='bg-black text-white my-10'>Guardar</Button>
          </div>
        </div>

        {/* PANEL DE IMÁGENES */}
        <div className="w-2/3 max-w-md mx-auto bg-emerald-400 rounded-2xl p-4 shadow-md space-y-4">
          {images[0] && (
            <div className="w-full aspect-square rounded-xl overflow-hidden relative">
              <img src={images[0]} alt="Imagen principal" className="object-cover w-full h-full" />
              <div className="absolute top-2 right-2 flex space-x-2">
                <label className="bg-white p-1 rounded-md shadow hover:bg-gray-100 cursor-pointer">
                  <Upload size={16} />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                </label>
                <button onClick={() => handleDelete(0)} className="bg-white p-1 rounded-md shadow hover:bg-gray-100">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}

          {!images[0] && (
            <div className="w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-300 transition relative">
              <label className="flex flex-col items-center justify-center w-full h-full">
                <ImagePlus size={32} />
                <span className="text-sm mt-2">Agregar imagen principal</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </label>
            </div>
          )}

          <h2 className="text-lg font-semibold">Imágenes Adicionales</h2>

          <div className="flex flex-wrap gap-4">
            {images.slice(1).map((img, idx) => (
              <div key={idx} className="relative size-24 rounded-xl overflow-hidden shadow bg-white">
                <img src={img} alt={`img-${idx}`} className="object-cover w-full h-full" />
                <div className="absolute top-1 right-1 flex space-x-1">
                  <button onClick={() => handleDelete(idx + 1)} className="bg-white p-0.5 rounded hover:bg-gray-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {images.length < 5 && (
              <label className="size-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-300 transition">
                <ImagePlus size={20} />
                <span className="text-xs text-center mt-1">Agregar imagen</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </label>
            )}
          </div>

          {/* Input para URL de imagen */}
          <div className="flex gap-2">
            <Input
              id="url-input"
              type="text"
              placeholder="Pegar URL de imagen"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button variant="secondary" onClick={handleAddUrlImage}>Agregar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
