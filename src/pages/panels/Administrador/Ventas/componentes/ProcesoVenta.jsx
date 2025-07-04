import * as React from "react"
import { useState, useEffect } from 'react'
import axios from 'axios';
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { DataTableVentas } from "./VentasTable/Ventastabla"
import { useLocation, useNavigate } from "react-router-dom"
import { RegistrarCliente } from '@/pages/panels/Administrador/Cliente/Components/NewClient';
import {Metodo} from "./Modales/Metodopago"
import { toast } from "sonner";
import ServiceVentas from "@/api/ServiceVentas"; // Asegúrate de tener esta ruta correcta

export function ProcesoVenta(){
    const [cliente, setCliente] = useState({
        id: null,
        nombre: '',
        apellido: '',
        documento: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const isAdmin = localStorage.getItem('userRole') === 'ADMIN';
    const [isLoading, setIsLoading] = React.useState(false); 
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    const [productos, setProductos] = React.useState(() => {
        const raw = location.state?.productos || [];
        console.log("Productos recibidos:", raw);
        
        return raw.map(p => ({
            id: p.id,
            nombre: p.nombreProducto || p.nombre || 'Sin nombre',
            detalle: [p.tipoProducto, p.categoria].filter(Boolean).join(' - ') || 'Sin detalle',
            cantidad: Number(p.cantidad) || 1,
            precio: Number(p.precio) || Number(p.precioVenta) || 0,
        }));
    });
    
    const total = productos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredClientes, setFilteredClientes] = useState([]);

    useEffect(() => {
        const resultados = clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredClientes(resultados);
    }, [search, clientes]);

    const fetchClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/api/clientes');
            setClientes(response.data);
            setFilteredClientes(response.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            setError("Error al cargar clientes");
            toast.error(error.response?.data || "No se pudo obtener la lista de clientes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchClientes();
    }, []);

    const handlePagar = async (metodoPago) => {
    if (!cliente.id) {
        toast.error("Seleccione un cliente antes de pagar");
        return;
    }

    if (productos.length === 0) {
        toast.error("No hay productos en el carrito");
        return;
    }

    setIsLoading(true);
    
    try {
        // Verificar stock antes de proceder (opcional)
        const verificacionStock = await Promise.all(
            productos.map(async producto => {
                const response = await axios.get(`http://localhost:8080/api/productos/${producto.id}/stock`);
                return {
                    id: producto.id,
                    nombre: producto.nombre,
                    stockDisponible: response.data.stock,
                    cantidadSolicitada: producto.cantidad
                };
            })
        );

        const productosSinStock = verificacionStock.filter(
            item => item.stockDisponible < item.cantidadSolicitada
        );

        if (productosSinStock.length > 0) {
            throw new Error(
                `Stock insuficiente para: ${productosSinStock.map(p => p.nombre).join(', ')}`
            );
        }

        // Crear objeto venta
        const venta = {
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellidos: cliente.apellido,
                identificacion: cliente.documento
            },
            detallesVenta: productos.map(producto => ({
                productoId: producto.id,
                cantidad: producto.cantidad,
                precioUnitario: producto.precio,
                subtotal: producto.precio * producto.cantidad
            })),
            metodoPago: metodoPago,
            total: total,
            fechaVenta: new Date().toISOString()
        };

        // Enviar la venta al backend
        await VentaService.crearVenta(venta);
        
        toast.success("Venta registrada exitosamente!");
        
        // Actualizar el estado local del stock (opcional)
        setProductos(prev => prev.map(p => {
            const productoActualizado = verificacionStock.find(item => item.id === p.id);
            return productoActualizado ? {
                ...p,
                stock: productoActualizado.stockDisponible - p.cantidad
            } : p;
        }));

        // Redirigir después de éxito
        setTimeout(() => navigate("/dashboard/ventas"), 2000);
        
    } catch (error) {
        console.error("Error al registrar la venta:", error);
        
        const mensajeError = error.response?.data?.includes("Stock insuficiente") 
            ? error.response.data 
            : `Error al registrar la venta: ${error.message}`;
            
        toast.error(mensajeError);
        
        // Mostrar detalles adicionales en consola para debug
        if (error.response) {
            console.error("Detalles del error:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        }
    } finally {
        setIsLoading(false);
        setOpen(false);
    }
};

    return (
        <div>
            <h1 className="font-semibold text-xl">DETALLE DE VENTA</h1>
            <Separator/>
            
            {/* Buscar y agregar Cliente */}
            <div className="grid grid-cols-2 my-4">    
                <div className="my-4 w-full span-col-2">
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput
                            placeholder="Ingrese el Nombre de un Cliente..."
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            {filteredClientes.length === 0 ? (
                                <CommandEmpty>Cliente no encontrado.</CommandEmpty>
                            ) : (
                                filteredClientes.map((cliente) => (
                                    <div
                                        key={cliente.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setCliente({
                                                id: cliente.id,    
                                                nombre: cliente.nombre,
                                                apellido: cliente.apellidos,
                                                documento: cliente.identificacion
                                            });
                                            setSearch(cliente.nombre);
                                        }}
                                    >
                                        {cliente.nombre} {cliente.apellidos}
                                    </div>
                                ))
                            )}
                        </CommandList>
                    </Command>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        {isAdmin && <RegistrarCliente onClienteAdded={fetchClientes} />}
                    </div>
                </div>
            </div>
            
            {/* Datos del Cliente a Comprar */}
            <p className="font-bold text-2xl text-black">Datos del Cliente</p>
            <div className="grid grid-cols-2 w-2/3 space-x-4 space-x-reverse">
                <Input
                    className="m-4"
                    placeholder="Nombre del Cliente"
                    value={cliente.nombre}
                    onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                />

                <Input 
                    className="m-4" 
                    placeholder="Apellido del Cliente"
                    value={cliente.apellido} 
                    onChange={(e) => setCliente({...cliente, apellido: e.target.value})} 
                />
                <Input 
                    className="m-4" 
                    placeholder="Número de RUC/DNI" 
                    value={cliente.documento}
                    onChange={(e) => setCliente({...cliente, documento: e.target.value})} 
                />
            </div>
            <Separator/>
            
            {/* Tabla de Detalle de Venta */}
            <p className="font-bold text-2xl text-black">Detalle de Venta</p>
            <div className="bg-white rounded-lg border shadow-sm p-4 my-4 mx-12 ">
                <DataTableVentas data={productos} isLoading={isLoading} />
                <div className="justify-end text-right font-bold text-lg mt-4">
                    TOTAL: S/ {total.toFixed(2)}
                </div>
            </div>
            
            <div className="grid grid-cols-2">
                <div onClick={() => navigate("/dashboard/ventas")} >
                    <Button>Regresar a Catalogos</Button>
                </div>
                <div>
                    <Button 
                        onClick={() => setOpen(true)} 
                        disabled={productos.length === 0 || !cliente.id || isLoading}
                    >
                        {isLoading ? "Procesando..." : "Ir a Métodos de Pagos"}
                    </Button>
                </div>
            </div>
            
            <Metodo
                open={open}
                onOpenChange={setOpen}
                carrito={productos}
                cliente={cliente}
                total={total}
                onPagar={handlePagar}
                isLoading={isLoading}
            />
        </div>
    )
}