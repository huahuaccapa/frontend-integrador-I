//src\pages\panels\Administrador\Proveedor\proveedor.jsx
import { useState, useEffect } from 'react';
import { TableDemoProveedor } from './componentes/TableDemoProveedor';
import { SheetDemoProveedor } from './componentes/SheetDemoProveedor';
import { Button } from "@/components/ui/button"; // Importa el botón
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import ServiceProveedores from '@/api/ServiceProveedores';

export function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isAdmin = true; // Para pruebas locales, simula un usuario administrador.


   // Cargar proveedores desde la API
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await ServiceProveedores.getAllProveedores();
        setProveedores(response.data);
        setFilteredProveedores(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los proveedores",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);



  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProveedores(proveedores);
    } else {
      const filtered = proveedores.filter(proveedor =>
        proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.ruc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProveedores(filtered);
    }
  }, [searchTerm, proveedores]);

  const handleAddProveedor = (nuevoProveedor) => {
    setProveedores(prev => [...prev, { id: Date.now(), ...nuevoProveedor }]);
    toast({
      title: "Proveedor añadido",
      description: `El proveedor ${nuevoProveedor.nombre} ha sido añadido.`,
      variant: "default",
    });
  };

  const handleDeleteProveedor = async (id) => {
    try {
 

      await ServiceProveedores.deleteProveedor(id);
      
      // Actualiza ambos estados (lista completa y lista filtrada)
      setProveedores(prev => prev.filter(p => p.id !== id));
      setFilteredProveedores(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Proveedor eliminado",
        description: "El proveedor ha sido eliminado correctamente",
        variant: "default",
      });
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor",
        variant: "destructive",
      });
    }
  };


  const navigateToPedidos = () => {
    // Lógica para redireccionar a la página de pedidos
    console.log("Navegando a pedidos...");
  };

   const handleProveedorUpdated = async () => {
    try {
      const response = await ServiceProveedores.getAllProveedores();
      setProveedores(response.data);
      setFilteredProveedores(response.data);
    } catch (error) {
      console.error("Error al actualizar lista:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista de proveedores",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-1">
      <div className="mb-4 flex items-center justify-between">
  {isAdmin && <SheetDemoProveedor onProveedorAdded={handleAddProveedor} />}

  <div className="flex items-center gap-4 ml-[-10%]">
    <Input
      type="text"
      placeholder="Buscar proveedores..."
      className="w-80"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Button 
      onClick={() => navigate("/dashboard/proveedores/pedidos")}
      className="bg-primary text-white px-6 py-2 rounded-md shadow-md hover:bg-primary-dark transition">
      Nuevos Pedidos
    </Button>
  </div>
</div>



      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando proveedores...</p>
        </div>
      ) : filteredProveedores.length === 0 ? (
        <div className="text-center p-8">
          <p>No hay proveedores {searchTerm ? 'que coincidan con la búsqueda' : 'registrados'}</p>
        </div>
      ) : (
        <TableDemoProveedor proveedores={filteredProveedores} onProveedorDeleted={handleDeleteProveedor} onProveedorUpdated={handleProveedorUpdated} />
      )}

      <Toaster />
    </div>
  );
}