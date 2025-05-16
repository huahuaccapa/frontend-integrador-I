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

export function CardWithForm({ producto, onGuardar }) {
  const [nombre, setNombre] = useState(producto.nombreProducto || producto.producto || "");
  const [precio, setPrecio] = useState(producto.precio || "");
  const [stock, setStock] = useState(producto.stock || 0);
  const [estado, setEstado] = useState(producto.estadoStock || producto.estado || "OPTIMO");
  const [tipo, setTipo] = useState(producto.tipoProducto || "ACCESORIO");

  const handleSubmit = (e) => {
    e.preventDefault();

    const productoEditado = {
      nombreProducto: nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      estadoStock: estado,
      tipoProducto: tipo,
      estado: estado // Mantener ambos por compatibilidad
    };

    onGuardar(productoEditado);
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Editar Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Nombre del Producto</Label>
            <Input 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Precio</Label>
            <Input 
              type="number" 
              step="0.01" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Stock</Label>
            <Input 
              type="number" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Tipo de Producto</Label>
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
          <div>
            <Label>Estado del Stock</Label>
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
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onGuardar(null)}>Cancelar</Button>
        <Button onClick={handleSubmit}>Guardar Cambios</Button>
      </CardFooter>
    </Card>
  );
}