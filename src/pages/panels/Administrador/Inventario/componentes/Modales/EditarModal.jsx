import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CardWithForm({ producto, onGuardar }) {
  const [nombre, setNombre] = useState(producto.nombreProducto || producto.producto || "");
  const [precio, setPrecio] = useState(producto.precio || "");
  const [stock, setStock] = useState(producto.stock || 0);
  const [estado, setEstado] = useState(producto.estadoStock || producto.estado || "activo");

  const handleSubmit = (e) => {
    e.preventDefault();

    const productoEditado = {
      nombreProducto: nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      estadoStock: estado,
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
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label>Precio</Label>
            <Input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
          <div>
            
            <Label>Estado</Label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full p-2 border rounded">
              <option value="OPTIMO">Optimo</option>
              <option value="MEDIO">Medio</option>
              <option value="BAJO">Bajo</option>
            </select>
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
