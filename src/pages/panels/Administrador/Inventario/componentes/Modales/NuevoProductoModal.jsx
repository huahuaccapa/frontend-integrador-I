import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NuevoProductoModal({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = React.useState({
    id: "",
    producto: "",
    precio: "",
    stock: "",
    estado: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validar que todos los campos estén completos
    if (Object.values(formData).some((value) => value === "")) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (onSubmit)
      onSubmit({
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
      }); // Convertir valores numéricos

    onOpenChange(false);
    setFormData({ id: "", producto: "", precio: "", stock: "", estado: "" });
  };

  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Agregar Nuevo Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={formData.id} onChange={handleChange} />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="producto">Producto</Label>
              <Input id="producto" value={formData.producto} onChange={handleChange} />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                value={formData.precio}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="estado">Estado</Label>
              <Select
                onValueChange={(value) => handleSelectChange("estado", value)}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Seleccionar Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </CardFooter>
      </Card>
    </div>
  ) : null;
}

