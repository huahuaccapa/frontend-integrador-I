import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceProveedores from "@/api/ServiceProveedores";
import ServicePedido from "@/api/ServicePedido";
import ServiceDetallePedido from "@/api/ServiceDetallePedido";

export function NuevoPedido() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detectar si estamos en modo edición
  const isEditing = location.state?.isEditing || false;
  const pedidoData = location.state?.pedidoData || null;

  const [productos, setProductos] = useState([]);
  const [proveedor, setProveedor] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [modoPago, setModoPago] = useState("Cancelado");
  const [nroPedido, setNroPedido] = useState("003");

  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(false);


  // Efecto para cargar datos del pedido a editar
  useEffect(() => {
  const cargarDatosEdicion = async () => {
    if (isEditing && pedidoData) {
      try {
        // Primero cargar los datos básicos del pedido
        setProveedor(pedidoData.proveedorId);
        setFechaEntrega(pedidoData.fechaEntrega || "");
        setModoPago(pedidoData.metodoPago || "Cancelado");
        setNroPedido(pedidoData.id.toString());

        // Luego cargar los detalles específicos
        const response = await ServiceDetallePedido.getAllDetalles();
        
        // Verificar que la respuesta tiene datos
        if (response.data && Array.isArray(response.data)) {
          // Convertir pedidoData.id a número para comparación estricta
          const pedidoIdNum = parseInt(pedidoData.id);
          
          const detallesPedido = response.data.filter(
            detalle => detalle.pedidoId === pedidoIdNum
          );

          console.log("Detalles cargados:", detallesPedido); // Para depuración
          
          setProductos(detallesPedido.map(detalle => ({
            id: detalle.id,
            descripcion: detalle.descripcion,
            modelo: detalle.modelo,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.cantidad * detalle.precioUnitario
          })));
        } else {
          console.error("Formato de respuesta inesperado:", response);
        }
      } catch (error) {
        console.error("Error al cargar detalles del pedido:", error);
        alert("Error al cargar los detalles del pedido");
      }
    }
  };
  
  cargarDatosEdicion();
}, [isEditing, pedidoData]);

  useEffect(() => {
  const cargarProveedores = async () => {
    try {
      const response = await ServiceProveedores.getAllProveedores(); // Agrega paréntesis
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      setProveedores([]); // Establece un array vacío como fallback
    }
  };
  
  cargarProveedores();
}, []);

 const handleAgregarProducto = async (producto) => {
    if (modalData?.index !== undefined) {
      // Editar producto existente
      if (productos[modalData.index].id) {
        // Si tiene ID, es un producto existente que debemos actualizar en el backend
        try {
          await ServiceDetallePedido.updateDetalle(
            productos[modalData.index].id,
            {
              modelo: producto.modelo,
              precioUnitario: producto.precioUnitario,
              cantidad: producto.cantidad,
              descripcion: producto.descripcion
            }
          );
          
          // Actualizar el estado local
          setProductos(prev =>
            prev.map((p, index) => (index === modalData.index ? producto : p))
          );
        } catch (error) {
          console.error("Error al actualizar detalle:", error);
          alert("Error al actualizar producto");
          return;
        }
      } else {
        // Producto nuevo que aún no se ha guardado en el backend
        setProductos(prev =>
          prev.map((p, index) => (index === modalData.index ? producto : p))
        );
      }
    } else {
      // Agregar nuevo producto
      if (isEditing) {
        // Si estamos editando, guardar primero en el backend
        try {
          const response = await ServiceDetallePedido.createDetalle({
            pedidoId: parseInt(nroPedido),
            modelo: producto.modelo,
            precioUnitario: producto.precioUnitario,
            cantidad: producto.cantidad,
            descripcion: producto.descripcion
          });
          
          // Agregar el producto con su ID
          setProductos(prev => [...prev, {
            ...producto,
            id: response.data.id
          }]);
        } catch (error) {
          console.error("Error al crear detalle:", error);
          alert("Error al agregar producto");
          return;
        }
      } else {
        // Si es un nuevo pedido, solo agregar al estado local
        setProductos(prev => [...prev, producto]);
      }
    }
    setModalData(null);
  };

  const handleEditarProducto = (index) => {
    setModalData({ ...productos[index], index });
  };

   const handleEliminarProducto = async (index) => {
    const producto = productos[index];
    
    if (producto.id) {
      // Si tiene ID, es un producto existente que debemos eliminar del backend
      try {
        await ServiceDetallePedido.deleteDetalle(producto.id);
        setProductos(prev => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error al eliminar detalle:", error);
        alert("Error al eliminar producto");
        return;
      }
    } else {
      // Producto nuevo que solo existe en el estado local
      setProductos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calcularTotal = () => {
    return productos.reduce((acc, producto) => acc + producto.subtotal, 0);
  };

const handleGuardar = async () => {
  if (!proveedor) {
    alert("Debe seleccionar un proveedor");
    return;
  }

  if (productos.length === 0) {
    alert("Debe agregar al menos un producto");
    return;
  }

  // Crear objeto pedido para enviar
  const pedido = {
    proveedorId: proveedor,
    estado: "PENDIENTE",
    metodoPago: modoPago,
    fechaEntrega,
    total: calcularTotal()
  };

  try {
    if (isEditing) {
      // Actualizar pedido existente
      await ServicePedido.updatePedido(nroPedido, pedido);
      
      // Guardar los productos nuevos (los que no tienen ID)
      const nuevosProductos = productos.filter(p => !p.id);
      for (const producto of nuevosProductos) {
        await ServiceDetallePedido.createDetalle({
          pedidoId: parseInt(nroPedido),
          modelo: producto.modelo,
          precioUnitario: producto.precioUnitario,
          cantidad: producto.cantidad,
          descripcion: producto.descripcion
        });
      }
      
      alert("Pedido actualizado correctamente");
    } else {
      // Crear nuevo pedido
      const response = await ServicePedido.createPedido(pedido);
      const nuevoPedidoId = response.data.id;
      
      // Guardar todos los productos asociados al nuevo pedido
      for (const producto of productos) {
        await ServiceDetallePedido.createDetalle({
          pedidoId: nuevoPedidoId,
          modelo: producto.modelo,
          precioUnitario: producto.precioUnitario,
          cantidad: producto.cantidad,
          descripcion: producto.descripcion
        });
      }
      
      alert("Pedido guardado correctamente");
      navigate("/dashboard/proveedores/pedidos");
    }
  } catch (error) {
    console.error("Error al guardar pedido:", error);
    alert("Error al guardar pedido, intente nuevamente");
  }
};

  return (
    <div className="p-2 space-y-4">
      <h1 className="text-2xl font-bold">
        PROVEEDORES/PEDIDO/{isEditing ? "EDITAR PEDIDO" : "NUEVO PEDIDO"}
      </h1>

      {/* Nro de pedido */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-semibold">Nro de Pedido:</label>
        <div className="px-4 py-2 bg-gray-100 rounded-md border text-gray-700">
          {nroPedido}
        </div>
      </div>

      {/* Proveedor */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-semibold">Proveedor:</label>
        <Select onValueChange={setProveedor} value={proveedor}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecciona un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedores.map((proveedor) => (
           <SelectItem key={proveedor.id} value={proveedor.id}>
             {proveedor.nombre}
                </SelectItem>
              ))}
            </SelectContent>
        </Select>
      </div>

      {/* Lista de productos */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-semibold">Lista de productos:</label>
        <Dialog open={!!modalData} onOpenChange={(open) => !open && setModalData(null)}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => setModalData({})} >
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ProductoModal
              data={modalData}
              onSave={handleAgregarProducto}
              onClose={() => setModalData(null)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de productos */}
      <div className="overflow-x-auto h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cantidad</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Precio Unitario</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay productos añadidos.
                </TableCell>
              </TableRow>
            ) : (
              productos.map((producto, index) => (
                 <TableRow key={producto.id || `new-${index}`}>
                  <TableCell>{producto.cantidad}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  <TableCell>{producto.modelo}</TableCell>
                  <TableCell>{producto.precioUnitario.toFixed(2)}</TableCell>
                  <TableCell>{producto.subtotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditarProducto(index)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleEliminarProducto(index)}
                      className="ml-2"
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Total, Fecha y Modo de Pago */}
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold">Total:</label>
            <div className="px-4 py-2 bg-gray-100 rounded-md border text-gray-700">
              {calcularTotal().toFixed(2)}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold">Fecha de Entrega:</label>
            <Input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold">Modo de Pago:</label>
            <Select onValueChange={setModoPago} value={modoPago}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Adelantado">Adelantado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 mt-4">
        <Button variant="secondary" onClick={() => navigate("/dashboard/proveedores/pedidos")}>
          Volver
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </div>
  );
}

function ProductoModal({ data, onSave, onClose }) {
  const [descripcion, setDescripcion] = useState(data?.descripcion || "");
  const [modelo, setModelo] = useState(data?.modelo || "");
  const [cantidad, setCantidad] = useState(data?.cantidad || 1);
  const [precioUnitario, setPrecioUnitario] = useState(data?.precioUnitario || 0);

  const handleSave = () => {
    const subtotal = cantidad * precioUnitario;
    onSave({ descripcion, modelo, cantidad, precioUnitario, subtotal });
    onClose();
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Producto a pedido</DialogTitle>
      </DialogHeader>
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Descripción</label>
        <Input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción del producto"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Modelo</label>
        <Input
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="Modelo del producto"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Cantidad</label>
        <Input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Precio Unitario</label>
        <Input
          type="number"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(Number(e.target.value))}
        />
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {data ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogFooter>
    </div>
  );
}