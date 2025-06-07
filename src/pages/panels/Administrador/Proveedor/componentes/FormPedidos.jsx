import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Pedido() {
  const navigate = useNavigate();

  const mockData = [
    { id: 1, nro: "001", descripcion: "Pedido de laptops", estado: "En Proceso", proveedor: "Proveedor A", pago: "Adelanto" },
    { id: 2, nro: "002", descripcion: "Pedido de teléfonos", estado: "Completado", proveedor: "Proveedor B", pago: "Cancelado" },
    { id: 1, nro: "001", descripcion: "Pedido de laptops", estado: "En Proceso", proveedor: "Proveedor A", pago: "Adelanto" },
    { id: 2, nro: "002", descripcion: "Pedido de teléfonos", estado: "Completado", proveedor: "Proveedor B", pago: "Cancelado" },
    { id: 1, nro: "001", descripcion: "Pedido de laptops", estado: "En Proceso", proveedor: "Proveedor A", pago: "Adelanto" },
    { id: 2, nro: "002", descripcion: "Pedido de teléfonos", estado: "Completado", proveedor: "Proveedor B", pago: "Cancelado" },
    { id: 1, nro: "001", descripcion: "Pedido de laptops", estado: "En Proceso", proveedor: "Proveedor A", pago: "Adelanto" },
    { id: 2, nro: "002", descripcion: "Pedido de teléfonos", estado: "Completado", proveedor: "Proveedor B", pago: "Cancelado" },
    { id: 1, nro: "001", descripcion: "Pedido de laptops", estado: "En Proceso", proveedor: "Proveedor A", pago: "Adelanto" },
    { id: 2, nro: "002", descripcion: "Pedido de teléfonos", estado: "Completado", proveedor: "Proveedor B", pago: "Cancelado" },
    { id: 1, nro: "001", descripcion: "Pedido de laptops", estado: "En Proceso", proveedor: "Proveedor A", pago: "Adelanto" },
    { id: 2, nro: "002", descripcion: "Pedido de teléfonos", estado: "Completado", proveedor: "Proveedor B", pago: "Cancelado" },
    { id: 1, nro: "001", descripcion: "Pedido de laptops", estado: "En Proceso", proveedor: "Proveedor A", pago: "Adelanto" },
    { id: 2, nro: "002", descripcion: "Pedido de teléfonos", estado: "Completado", proveedor: "Proveedor B", pago: "Cancelado" },
    // Agrega más datos ficticios aquí si lo necesitas
  ];

  return (
    <div className="relative flex flex-col h-screen p-2">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-4"> PROVEEDORES/PEDIDOS </h1>

      {/* Buscador */}
      <div className="mb-4">
        <Input type="text" placeholder="Buscar pedidos..." className="w-full max-w-lg" />
      </div>

      {/* Tabla */}
      <div className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nro Pedido</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.nro}</TableCell>
                <TableCell>{pedido.descripcion}</TableCell>
                <TableCell>{pedido.estado}</TableCell>
                <TableCell>{pedido.proveedor}</TableCell>
                <TableCell>{pedido.pago}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate("/dashboard/proveedores/pedidos/nuevo")
                    }
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Botones */}
      <div className="sticky bottom-0 bg-white py-4 flex justify-end space-x-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/proveedores")}
        >
          Volver
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate("/dashboard/proveedores/pedidos/nuevo")}
        >
          Nuevo Pedido
        </Button>
      </div>
    </div>
  );
}