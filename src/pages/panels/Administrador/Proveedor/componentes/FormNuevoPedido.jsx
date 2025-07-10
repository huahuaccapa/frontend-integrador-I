//src\pages\panels\Administrador\Proveedor\componentes\FormNuevoPedido.jsx
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
  
    // Al inicio del componente o dentro de useEffect según tu estructura
const hoy = new Date();
const fechaMinima = new Date(hoy);
fechaMinima.setDate(hoy.getDate() + 4);

// Convertirla a formato YYYY-MM-DD para usar en el input
const fechaMinimaStr = fechaMinima.toISOString().split('T')[0];

  // Detectar si estamos en modo edición
  const isEditing = location.state?.isEditing || false;
  const pedidoData = location.state?.pedidoData || null;

  const [productos, setProductos] = useState([]);
  const [proveedor, setProveedor] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState(fechaMinimaStr);
  const [modoPago, setModoPago] = useState("Cancelado");
  const [nroPedido, setNroPedido] = useState(""); 

  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(false);



useEffect(() => {
  console.log("Estado actual:", {
    isEditing,
    nroPedido,
    productos,
    proveedor
  });
}, [isEditing, nroPedido, productos, proveedor]);
  // Efecto para cargar datos del pedido a editar
useEffect(() => {
  const cargarDatosEdicion = async () => {
    if (isEditing && pedidoData) {
      try {
        // Cargar datos básicos del pedido
        setProveedor(pedidoData.proveedorId);
        setFechaEntrega(pedidoData.fechaEntrega || "");
        setModoPago(pedidoData.metodoPago || "Cancelado");
        setNroPedido(pedidoData.id.toString());

        // Cargar detalles específicos usando el ID del pedido
        const response = await ServiceDetallePedido.getDetallesByPedidoId(pedidoData.id);
        
        if (response.data && Array.isArray(response.data)) {
          setProductos(response.data.map(detalle => ({
            id: detalle.id,
            descripcion: detalle.descripcion,
            modelo: detalle.modelo,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.cantidad * detalle.precioUnitario
          })));
          
          console.log("Detalles cargados correctamente:", response.data);
        }
      } catch (error) {
        console.error("Error al cargar detalles del pedido:", error);
        alert("Error al cargar los productos del pedido");
      }finally{
        setCargando(false);
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
    // ... (código existente para edición)
  } else {
    // Agregar nuevo producto
    if (isEditing) {
      try {
        // Verificar que tenemos el ID del pedido
        if (!nroPedido) {
          throw new Error("No se encontró el ID del pedido");
        }

        // Crear el objeto con la estructura exacta que espera el backend
        const detalleParaBackend = {
          modelo: producto.modelo,
          precioUnitario: producto.precioUnitario,
          cantidad: producto.cantidad,
          descripcion: producto.descripcion,
          subtotal: producto.subtotal,
          pedido: {
            id: parseInt(nroPedido) // Estructura anidada como requiere el backend
          }
        };

        console.log("Enviando al backend:", detalleParaBackend); // Para depuración

        const response = await ServiceDetallePedido.createDetalle(detalleParaBackend);

        // Verificar la respuesta
        console.log("Respuesta del backend:", response.data);

        // Agregar el producto con su ID generado por el backend
        setProductos(prev => [...prev, {
          ...producto,
          id: response.data.id
        }]);
      } catch (error) {
        console.error("Error al crear detalle:", {
          error: error.response?.data || error.message,
          status: error.response?.status
        });
        alert(`Error al agregar producto: ${error.response?.data?.message || error.message}`);
        return;
      }
    } else {
      // Si es un nuevo pedido (no en modo edición)
      setProductos(prev => [...prev, producto]);
    }
  }
  setModalData(null);
};
  const handleEditarProducto = (index) => {
    setModalData({ 
      ...productos[index], 
      index,
      isEditing: true // Bandera para saber que estamos editando
    });
};

const handleEliminarProducto = async (index) => {
  const producto = productos[index];
  if (!producto?.id) {
    console.error("Producto sin ID, eliminando solo localmente");
    setProductos(prev => prev.filter((_, i) => i !== index));
    return;
  }

  const confirmar = window.confirm(`¿Eliminar ${producto.modelo}?`);
  if (!confirmar) return;

  try {
    console.log("[DELETE] Iniciando eliminación para ID:", producto.id);
    
    // 1. Intento de eliminación en backend
    const response = await ServiceDetallePedido.deleteDetalle(producto.id);
    console.log("[DELETE] Respuesta del servidor:", response);

    // 2. Verificación adicional
    try {
      const verify = await ServiceDetallePedido.getDetalleById(producto.id);
      if (verify.data) {
        throw new Error("El detalle sigue existiendo después del DELETE");
      }
    } catch (verifyError) {
      // Esperado: Debería dar 404 si se eliminó correctamente
      console.log("[DELETE] Verificación exitosa (404 esperado)");
    }

    // 3. Eliminación local
    setProductos(prev => prev.filter((_, i) => i !== index));
    console.log("[DELETE] Eliminación local completada");
    
  } catch (error) {
    console.error("[DELETE ERROR] Detalles completos:", {
      message: error.message,
      response: error.response,
      config: error.config,
      stack: error.stack
    });

    // Mostrar error específico al usuario
    const errorMsg = error.response?.data?.message || 
                    error.message || 
                    "Error desconocido al eliminar";
    
    alert(`Error al eliminar: ${errorMsg}`);

    // Recarga forzada de datos
    if (isEditing && nroPedido) {
      console.log("[DELETE] Recargando datos...");
      try {
        const { data } = await ServiceDetallePedido.getDetallesByPedidoId(nroPedido);
        setProductos(data.map(item => ({
          id: item.id_detalle || item.id, // Asegurar compatibilidad
          descripcion: item.descripcion,
          modelo: item.modelo,
          cantidad: item.cantidad,
          precioUnitario: item.precio_unitario || item.precioUnitario,
          subtotal: item.subtotal || (item.cantidad * (item.precio_unitario || item.precioUnitario))
        })));
      } catch (refreshError) {
        console.error("[DELETE] Error al recargar:", refreshError);
      }
    }
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

  const pedido = {
    proveedorId: proveedor,
    estado: "PENDIENTE",
    metodoPago: modoPago,
    fechaEntrega,
    total: calcularTotal(),
    detallePedido: productos.filter(p => !p.id).map(p => ({
      modelo: p.modelo,
      precioUnitario: p.precioUnitario,
      cantidad: p.cantidad,
      descripcion: p.descripcion
    }))
  };

  try {
    if (isEditing) {
      // Actualizar pedido existente
      await ServicePedido.updatePedido(nroPedido, {
        proveedorId: proveedor,
        estado: "PENDIENTE",
        metodoPago:modoPago,
        fechaEntrega,
        total: calcularTotal()
      });

      alert("Pedido actualizado correctamente");
      navigate("/dashboard/proveedores/pedidos");
    } else {
      // Crear nuevo pedido
      const response = await ServicePedido.createPedido(pedido);

       if (response.data?.detallePedido) {
        setProductos(prev => 
          prev.map((p, index) => ({
            ...p,
            id: response.data.detallePedido[index]?.id || p.id
          }))
        );
      }
      
      alert("Pedido creado correctamente");
      navigate("/dashboard/proveedores/pedidos");
    }
  } catch (error) {
    console.error("Error al guardar pedido:", error);
    alert("Error al guardar pedido: " + (error.response?.data?.message || error.message));
  }
  
};
  return (
    <div className="p-2 space-y-4">
      <h1 className="text-2xl font-bold">
        PROVEEDORES/PEDIDO/{isEditing ? "EDITAR PEDIDO" : "NUEVO PEDIDO"}
      </h1>

      {/* Nro de pedido */}
      {isEditing && (
  <div className="flex items-center space-x-4">
    <label className="text-sm font-semibold">Nro de Pedido:</label>
    <div className="px-4 py-2 bg-gray-100 rounded-md border text-gray-700">
      {nroPedido}
    </div>
  </div>
)}


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
            <label className="text-sm font-semibold">Fecha de Entrega Provista:</label>
            <Input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              min={fechaMinimaStr}
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

  useEffect(() => {
    // Resetear el formulario cuando cambian los datos
    if (data) {
      setDescripcion(data.descripcion || "");
      setModelo(data.modelo || "");
      setCantidad(data.cantidad || 1);
      setPrecioUnitario(data.precioUnitario || 0);
    }
  }, [data]);
  
  const handleSave = () => {
    if (!modelo || !descripcion || !cantidad || !precioUnitario) {
      alert("Por favor complete todos los campos");
      return;
    }

    const subtotal = cantidad * precioUnitario;
    onSave({ 
      descripcion, 
      modelo, 
      cantidad, 
      precioUnitario, 
      subtotal 
    });
    onClose();
  };

  return (
      
      
      <div className="space-y-4">
          <DialogHeader>
        <DialogTitle>
          {data?.isEditing ? "Editar Producto" : "Agregar Producto"}
        </DialogTitle>
      </DialogHeader>
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