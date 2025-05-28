import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/components/ui/use-toast";

export function CardWithForm({ producto, onGuardar }) {
  const [nombre, setNombre] = useState(producto.nombreProducto || producto.producto || "");
  const [precio, setPrecio] = useState(producto.precio?.toString() || "");
  const [stock, setStock] = useState(producto.stock?.toString() || "");
  const [estado, setEstado] = useState(producto.estadoStock || producto.estado || "OPTIMO");
  const [tipo, setTipo] = useState(producto.tipoProducto || "ACCESORIO");
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio || isNaN(parseFloat(precio)) || !stock || isNaN(parseInt(stock))) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const productoEditado = {
      nombreProducto: nombre.trim(),
      precio: parseFloat(precio),
      stock: parseInt(stock),
      estadoStock: estado,
      tipoProducto: tipo,
      estado: estado
    };

    onGuardar(productoEditado);
  };

  const formatPrecio = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Editar producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Producto*</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (S/)*</Label>
              <Input
                id="precio"
                type="text"
                value={precio}
                onChange={(e) => setPrecio(formatPrecio(e.target.value))}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock*</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Producto*</Label>
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
            <div className="space-y-2">
              <Label htmlFor="estado">Estado del Stock*</Label>
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
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => onGuardar(null)}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
        >
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  );
}