import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ServicePedido from "@/api/ServicePedido"; // Ruta correcta de pedidos
import ServiceProveedores from "@/api/ServiceProveedores";

export function Pedido() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [proveedores, setProveedores] = useState({}); // Mapa {id: nombre}

  useEffect(() => {
    // Cargar pedidos y proveedores en paralelo
    Promise.all([
      ServicePedido.getAllPedidos(),
      ServiceProveedores.getAllProveedores()
    ])
      .then(([pedidosRes, proveedoresRes]) => {
        setPedidos(pedidosRes.data);

        // Construir mapa de proveedores
        const mapaProveedores = {};
        proveedoresRes.data.forEach((p) => {
          mapaProveedores[p.id] = p.nombre; // Ajusta "nombre" si el campo se llama diferente
        });
        setProveedores(mapaProveedores);
      })
      .catch((error) => {
        console.error("Error cargando datos:", error);
      });
  }, []);

  const handleEditarPedido = (pedido) => {
    navigate("/dashboard/proveedores/pedidos/nuevo", {
      state: {
        isEditing: true,
        pedidoData: pedido,
      },
    });
  };

  const handleEliminarPedido = (pedidoId) => {
  // Confirmar antes de eliminar (opcional pero recomendado)
  if (!window.confirm("¿Seguro que quieres eliminar este pedido?")) return;

  ServicePedido.deletePedido(pedidoId)
    .then(() => {
      // Filtrar el pedido eliminado para actualizar el estado
      setPedidos((prevPedidos) => prevPedidos.filter(p => p.id !== pedidoId));
    })
    .catch((error) => {
      console.error("Error al eliminar el pedido:", error);
      alert("No se pudo eliminar el pedido. Intenta más tarde.");
    });
};

  

  return (
    <div className="relative flex flex-col h-screen p-2">
      <h1 className="text-2xl font-bold mb-4">PROVEEDORES / PEDIDOS</h1>

      <div className="mb-4">
        <Input type="text" placeholder="Buscar pedidos..." className="w-full max-w-lg" />
      </div>

      <div className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Método Pago</TableHead>
              <TableHead>Fecha Entrega</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{pedido.estado}</TableCell>
                {/* Mostrar nombre del proveedor en vez de ID */}
                <TableCell>{proveedores[pedido.proveedorId] || pedido.proveedorId}</TableCell>
                <TableCell>{pedido.metodoPago}</TableCell>
                <TableCell>{pedido.fechaEntrega}</TableCell>
                <TableCell>{pedido.total}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditarPedido(pedido)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
  variant="destructive"
  size="sm"
  onClick={() => handleEliminarPedido(pedido.id)}
>
  <Trash className="w-4 h-4" />
</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="sticky bottom-0 bg-white py-4 flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => navigate("/dashboard/proveedores")}>
          Volver
        </Button>
        <Button variant="primary" onClick={() => navigate("/dashboard/proveedores/pedidos/nuevo")}>
          Nuevo Pedido
        </Button>
      </div>
    </div>
  );
}
