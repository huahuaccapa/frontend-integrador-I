import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CrearProductoModal({ onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [estado, setEstado] = useState("OPTIMO");
  const [tipo, setTipo] = useState("ACCESORIO");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !precio || !stock) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevoProducto = {
      nombreProducto: nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      estadoStock: estado,
      tipoProducto: tipo,
    };

    onGuardar(nuevoProducto);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Agregar Nuevo Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label htmlFor="nombre">Nombre del Producto</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Batería A14"
              required
            />
          </div>

          <div>
            <Label htmlFor="precio">Precio</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 12.50"
              required
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Ej: 10"
              required
            />
          </div>

          <div>
            <Label htmlFor="estado">Estado Stock</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPTIMO">Óptimo</SelectItem>
                <SelectItem value="MEDIO">Medio</SelectItem>
                <SelectItem value="BAJO">Bajo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de Producto</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACCESORIO">Accesorio</SelectItem>
                <SelectItem value="REPUESTO">Repuesto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onGuardar(null)}>
          Cancelar
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Guardar Producto
        </Button>
      </CardFooter>
    </Card>
  );
}