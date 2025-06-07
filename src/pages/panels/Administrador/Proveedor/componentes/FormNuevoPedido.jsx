import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  const proveedoresRegistrados = ["Proveedor A", "Proveedor B", "Proveedor C"];

  // Efecto para cargar datos del pedido a editar
  useEffect(() => {
    if (isEditing && pedidoData) {
      setProductos(pedidoData.productos || []);
      setProveedor(pedidoData.proveedor);
      setFechaEntrega(pedidoData.fechaEntrega || "");
      setModoPago(pedidoData.pago || "Cancelado");
      setNroPedido(pedidoData.nro);
    }
  }, [isEditing, pedidoData]);

  const handleAgregarProducto = (producto) => {
    if (modalData?.index !== undefined) {
      // Editar producto existente
      setProductos((prev) =>
        prev.map((p, index) => (index === modalData.index ? producto : p))
      );
    } else {
      // Agregar nuevo producto
      setProductos((prev) => [...prev, producto]);
    }
    setModalData(null);
  };

  const handleEditarProducto = (index) => {
    setModalData({ ...productos[index], index });
  };

  const handleEliminarProducto = (index) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return productos.reduce((acc, producto) => acc + producto.subtotal, 0);
  };

  const handleGuardar = () => {
    if (isEditing) {
      alert("Pedido actualizado correctamente");
    } else {
      alert("Pedido guardado correctamente");
    }
    // Aquí puedes agregar la lógica para guardar/actualizar el pedido
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
            {proveedoresRegistrados.map((prov, index) => (
              <SelectItem key={index} value={prov}>
                {prov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de productos */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-semibold">Lista de productos:</label>
        <Dialog open={!!modalData} onOpenChange={(open) => !open && setModalData(null)}>
          <DialogTrigger>
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
                <TableRow key={index}>
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