import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, ImagePlus } from "lucide-react";
import axios from "axios";

// Servicio de subida de imágenes
import uploadImage from "@/api/upload";

export function CrearProductoModal({ open, onOpenChange, onGuardar }) {
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
    imagenes: [],
  });

  const [images, setImages] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Reiniciar formulario al abrir
      setProducto({
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
        imagenes: [],
      });
      setImages([]);
      setUrlInput("");
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const imageUrl = await uploadImage(file);
    setIsLoading(false);

    if (imageUrl) {
      setImages((prev) => [...prev, imageUrl]);
    }
  };

  const handleAddUrlImage = () => {
    if (urlInput.trim() !== "") {
      setImages((prev) => [...prev, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const handleDeleteImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = async () => {
    if (!producto.nombreProducto.trim() || !producto.codigo.trim()) {
      alert("Nombre y código son obligatorios");
      return;
    }

    try {
      const response = await axios.post(
        "https://multiservicios-85dff762daa1.herokuapp.com/api/v1/productos",
        {
          ...producto,
          imagenes: images,
        }
      );

      onGuardar(response.data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Hubo un error al guardar el producto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 bg-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Agregar Nuevo Producto
          </DialogTitle>
        </DialogHeader>

        {/* Campos del formulario */}
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="codigo" className="text-right text-gray-700">
              Código:
            </label>
            <Input
              id="codigo"
              name="codigo"
              value={producto.codigo}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="nombreProducto"
              className="text-right text-gray-700"
            >
              Nombre:
            </label>
            <Input
              id="nombreProducto"
              name="nombreProducto"
              value={producto.nombreProducto}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="categoria" className="text-right text-gray-700">
              Categoría:
            </label>
            <Select
              name="categoria"
              value={producto.categoria}
              onValueChange={(value) =>
                setProducto((prev) => ({ ...prev, categoria: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categorías</SelectLabel>
                  <SelectItem value="accesorios">Accesorios</SelectItem>
                  <SelectItem value="electronica">Electrónica</SelectItem>
                  <SelectItem value="ropa">Ropa</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="precioCompra" className="text-right text-gray-700">
              Precio Compra:
            </label>
            <Input
              id="precioCompra"
              name="precioCompra"
              type="number"
              value={producto.precioCompra}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="precioVenta" className="text-right text-gray-700">
              Precio Venta:
            </label>
            <Input
              id="precioVenta"
              name="precioVenta"
              type="number"
              value={producto.precioVenta}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="stock" className="text-right text-gray-700">
              Stock:
            </label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={producto.stock}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="marca" className="text-right text-gray-700">
              Marca:
            </label>
            <Input
              id="marca"
              name="marca"
              value={producto.marca}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="estado" className="text-right text-gray-700">
              Estado:
            </label>
            <Select
              name="estado"
              value={producto.estado}
              onValueChange={(value) =>
                setProducto((prev) => ({ ...prev, estado: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estado</SelectLabel>
                  <SelectItem value="OPTIMO">Óptimo</SelectItem>
                  <SelectItem value="MEDIO">Medio</SelectItem>
                  <SelectItem value="BAJO">Bajo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Imágenes */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Imágenes</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded overflow-hidden border"
                >
                  <img
                    src={img}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                disabled={isLoading}
              />
              <span className="text-xs text-gray-500">
                {isLoading ? "Subiendo..." : ""}
              </span>
            </div>

            {/* Añadir por URL */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Pegar URL de imagen"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button variant="secondary" onClick={handleAddUrlImage}>
                Agregar
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="bg-black text-white mt-4"
            disabled={isLoading}
          >
            Guardar Producto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}