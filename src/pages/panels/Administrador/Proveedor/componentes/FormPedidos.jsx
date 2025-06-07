import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Pedido() {
  const navigate = useNavigate();

  // Datos simulados más completos para el ejemplo
  const mockData = [
    { 
      id: 1, 
      nro: "001", 
      descripcion: "Pedido de laptops", 
      estado: "En Proceso", 
      proveedor: "Proveedor A", 
      pago: "Adelanto",
      fechaEntrega: "2024-12-15",
      productos: [
        { descripcion: "Laptop HP", modelo: "Pavilion 15", cantidad: 2, precioUnitario: 800, subtotal: 1600 },
        { descripcion: "Mouse", modelo: "Logitech M100", cantidad: 2, precioUnitario: 25, subtotal: 50 }
      ]
    },
    { 
      id: 2, 
      nro: "002", 
      descripcion: "Pedido de teléfonos", 
      estado: "Completado", 
      proveedor: "Proveedor B", 
      pago: "Cancelado",
      fechaEntrega: "2024-11-20",
      productos: [
        { descripcion: "iPhone", modelo: "14 Pro", cantidad: 1, precioUnitario: 1200, subtotal: 1200 }
      ]
    },
    // Puedes agregar más datos aquí...
  ];

  const handleEditarPedido = (pedido) => {
    // Navegar a la página de nuevo pedido con los datos del pedido a editar
    navigate("/dashboard/proveedores/pedidos/nuevo", {
      state: {
        isEditing: true,
        pedidoData: pedido
      }
    });
  };

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
                    onClick={() => handleEditarPedido(pedido)}
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