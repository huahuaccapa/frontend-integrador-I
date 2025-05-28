import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";

export function CrearProductoModal({ onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [estado, setEstado] = useState("OPTIMO");
  const [tipo, setTipo] = useState("ACCESORIO");
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

    const nuevoProducto = {
      nombreProducto: nombre.trim(),
      precio: parseFloat(precio),
      stock: parseInt(stock),
      estadoStock: estado,
      tipoProducto: tipo,
    };

    onGuardar(nuevoProducto);
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
        <CardTitle className="text-lg">producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Producto*</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Batería A14"
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
                placeholder="0"
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
              <Label htmlFor="estado">Estado Stock*</Label>
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
        <Button variant="outline" onClick={() => onGuardar(null)}>
          Cancelar
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Crear producto
        </Button>
      </CardFooter>
    </Card>
  );
}