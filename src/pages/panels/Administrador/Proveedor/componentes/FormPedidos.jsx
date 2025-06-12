import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pencil, Trash, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ServicePedido from "@/api/ServicePedido";
import ServiceProveedores from "@/api/ServiceProveedores";

export function Pedido() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [proveedores, setProveedores] = useState({});
  const [modalEstado, setModalEstado] = useState({ open: false, pedido: null });
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  // Estados posibles y sus transiciones
  const estadosTransicion = {
    "PENDIENTE": "En tránsito",
    "En tránsito": "Recibido",
    "Recibido": null // No puede cambiar más
  };

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
          mapaProveedores[p.id] = p.nombre;
        });
        setProveedores(mapaProveedores);
      })
      .catch((error) => {
        console.error("Error cargando datos:", error);
      });
  }, []);

  // Función para determinar si se pueden editar/eliminar pedidos
  const puedeEditarEliminar = (estado) => {
    return estado === "PENDIENTE";
  };

  // Función para determinar si se puede actualizar el estado
  const puedeActualizarEstado = (estado) => {
    return estadosTransicion[estado] !== null;
  };

  // Función para obtener el siguiente estado posible
  const getSiguienteEstado = (estadoActual) => {
    return estadosTransicion[estadoActual];
  };

  const handleEditarPedido = (pedido) => {
    navigate("/dashboard/proveedores/pedidos/nuevo", {
      state: {
        isEditing: true,
        pedidoData: pedido,
      },
    });
  };

  const handleEliminarPedido = (pedidoId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este pedido?")) return;

    ServicePedido.deletePedido(pedidoId)
      .then(() => {
        setPedidos((prevPedidos) => prevPedidos.filter(p => p.id !== pedidoId));
      })
      .catch((error) => {
        console.error("Error al eliminar el pedido:", error);
        alert("No se pudo eliminar el pedido. Intenta más tarde.");
      });
  };

  const handleAbrirModalEstado = (pedido) => {
    const siguienteEstado = getSiguienteEstado(pedido.estado);
    setNuevoEstado(siguienteEstado);
    setModalEstado({ open: true, pedido });
  };

  const handleActualizarEstado = async () => {
    if (!modalEstado.pedido || !nuevoEstado) return;

    setActualizandoEstado(true);

    try {
      // Llamar al servicio para actualizar el estado
      await ServicePedido.updateEstadoPedido(modalEstado.pedido.id, nuevoEstado);

      // Actualizar el estado local
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.id === modalEstado.pedido.id 
            ? { ...pedido, estado: nuevoEstado }
            : pedido
        )
      );

      // Cerrar modal y mostrar mensaje de éxito
      setModalEstado({ open: false, pedido: null });
      setNuevoEstado("");
      alert("Estado actualizado correctamente");

    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Error al actualizar el estado. Intenta más tarde.");
    } finally {
      setActualizandoEstado(false);
    }
  };

  const handleCerrarModal = () => {
    setModalEstado({ open: false, pedido: null });
    setNuevoEstado("");
  };

  // Función para obtener el color del badge según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800";
      case "En tránsito":
        return "bg-blue-100 text-blue-800";
      case "Recibido":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </TableCell>
                <TableCell>{proveedores[pedido.proveedorId] || pedido.proveedorId}</TableCell>
                <TableCell>{pedido.metodoPago}</TableCell>
                <TableCell>{pedido.fechaEntrega}</TableCell>
                <TableCell>${pedido.total}</TableCell>
                <TableCell className="flex space-x-2">
                  {/* Botón Actualizar Estado - Solo si puede cambiar */}
                  {puedeActualizarEstado(pedido.estado) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAbrirModalEstado(pedido)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {/* Botón Editar - Solo si está pendiente */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditarPedido(pedido)}
                    disabled={!puedeEditarEliminar(pedido.estado)}
                    className={!puedeEditarEliminar(pedido.estado) ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  
                  {/* Botón Eliminar - Solo si está pendiente */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleEliminarPedido(pedido.id)}
                    disabled={!puedeEditarEliminar(pedido.estado)}
                    className={!puedeEditarEliminar(pedido.estado) ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal para actualizar estado */}
      <Dialog open={modalEstado.open} onOpenChange={handleCerrarModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Estado del Pedido</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Pedido ID:</strong> {modalEstado.pedido?.id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Estado actual:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(modalEstado.pedido?.estado)}`}>
                  {modalEstado.pedido?.estado}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Nuevo Estado:</label>
              <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Selecciona el nuevo estado" />
  </SelectTrigger>
  <SelectContent>
    {getSiguienteEstado(modalEstado.pedido?.estado) && (
      <SelectItem value={getSiguienteEstado(modalEstado.pedido?.estado)}>
        {getSiguienteEstado(modalEstado.pedido?.estado)}
      </SelectItem>
    )}
  </SelectContent>
</Select>

            </div>

            <div className="text-sm text-gray-500">
              <p><strong>Nota:</strong> Una vez actualizado el estado, no podrás revertirlo.</p>
              {nuevoEstado !== "Recibido" && (
                <p>Después de cambiar a "{nuevoEstado}", solo podrás avanzar al siguiente estado.</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={handleCerrarModal}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleActualizarEstado}
              disabled={actualizandoEstado || !nuevoEstado}
            >
              {actualizandoEstado ? "Actualizando..." : "Confirmar Cambio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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