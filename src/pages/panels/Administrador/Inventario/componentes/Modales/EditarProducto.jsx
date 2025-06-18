import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Trash2, Upload, ImagePlus } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export function EditarProducto({ open, onOpenChange, producto, onGuardar }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    codigo: "",
    nombreProducto: "",
    categoria: "",
    stock: 0,
    stockMinimo: 0,
    stockMaximo: 0,
    precioCompra: 0,
    precioVenta: 0,
    imagenes: []
  });
  const [images, setImages] = useState([]);

  // Inicializar con datos del producto
  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo || "",
        nombreProducto: producto.nombreProducto || producto.producto || "",
        categoria: producto.categoria || "accesorios",
        stock: producto.stock || 0,
        stockMinimo: producto.stockMinimo || 0,
        stockMaximo: producto.stockMaximo || 0,
        precioCompra: producto.precioCompra || 0,
        precioVenta: producto.precioVenta || 0,
        imagenes: producto.imagenes || []
      });
      setImages(producto.imagenes || []);
    }
  }, [producto]);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...images, reader.result];
      setImages(newImages);
      setFormData(prev => ({ ...prev, imagenes: newImages }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    setFormData(prev => ({ ...prev, imagenes: updated }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nombreProducto.trim() || !formData.codigo.trim()) {
      toast({
        title: "Error",
        description: "Código y nombre son campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    // Convertir números
    const productoActualizado = {
      ...formData,
      stock: Number(formData.stock),
      stockMinimo: Number(formData.stockMinimo),
      stockMaximo: Number(formData.stockMaximo),
      precioCompra: Number(formData.precioCompra),
      precioVenta: Number(formData.precioVenta)
    };

    onGuardar(productoActualizado);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-2 bg-green-800">
        <SheetHeader>
          <SheetTitle className='font-semibold text-2xl text-white'>Editar Producto</SheetTitle>
          <Separator/>
        </SheetHeader>
        <div className="grid gap-4">
          {/* Sección de imágenes */}
          <div>
            <Label htmlFor="name" className="text-right text-white">
              Imágenes:
            </Label>                          
            <div className="flex flex-wrap gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow bg-white">
                  <img src={img} alt={`img-${idx}`} className="object-cover w-full h-full" />
                  <div className="absolute top-1 right-1 flex space-x-1">
                    <button 
                      className="bg-white p-0.5 rounded hover:bg-gray-100"
                      onClick={() => handleDeleteImage(idx)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <label className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-green-300 transition">
                <ImagePlus size={20} />
                <span className="text-xs text-center mt-1">Agregar imagen</span>
                <input 
                  type="file" 
                  onChange={handleAddImage} 
                  className="hidden" 
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codigo" className="text-right text-white">
              Código:
            </Label>
            <Input 
              id="codigo" 
              className="col-span-3 bg-white" 
              value={formData.codigo}
              onChange={(e) => handleChange('codigo', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="producto" className="text-right text-white">
              Producto:
            </Label>
            <Input 
              id="producto" 
              className="col-span-3 bg-white" 
              value={formData.nombreProducto}
              onChange={(e) => handleChange('nombreProducto', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoria" className="text-right text-white">
              Categoria:
            </Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => handleChange('categoria', value)}
            >
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
              <Label className="text-right text-white">Stock:</Label>
              <Input 
                className="col-span-3 bg-white" 
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-right text-white">Min:</Label>
              <Input 
                className="col-span-3 bg-white" 
                type="number"
                value={formData.stockMinimo}
                onChange={(e) => handleChange('stockMinimo', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-right text-white">Max:</Label>
              <Input 
                className="col-span-3 bg-white" 
                type="number"
                value={formData.stockMaximo}
                onChange={(e) => handleChange('stockMaximo', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="precioCompra" className="text-right text-white">
              Precio de Compra:
            </Label>
            <Input 
              id="precioCompra" 
              className="col-span-3 bg-white" 
              type="number"
              value={formData.precioCompra}
              onChange={(e) => handleChange('precioCompra', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="precioVenta" className="text-right text-white">
              Precio de Venta:
            </Label>
            <Input 
              id="precioVenta" 
              className="col-span-3 bg-white" 
              type="number"
              value={formData.precioVenta}
              onChange={(e) => handleChange('precioVenta', e.target.value)}
            />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button 
              variant="outline" 
              className="mr-2 text-white border-white hover:text-green-800 hover:bg-white"
            >
              Cancelar
            </Button>
          </SheetClose>
          <Button 
            type="submit" 
            onClick={handleSubmit}
          >
            Guardar Cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}