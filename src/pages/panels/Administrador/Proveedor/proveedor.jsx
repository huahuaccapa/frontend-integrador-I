import { useState, useEffect } from 'react';
import { TableDemoProveedor } from './componentes/TableDemoProveedor';
import { SheetDemoProveedor } from './componentes/SheetDemoProveedor';
import { Button } from "@/components/ui/button"; // Importa el botón
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isAdmin = true; // Para pruebas locales, simula un usuario administrador.

  const mockProveedores = [
    { id: 1, ruc: "20123456789", nombre: "Proveedor 1", telefono: "987654321", correo: "prov1@example.com", ubicacion: "Lima", rubro: "Tecnología" },
    { id: 2, ruc: "20234567890", nombre: "Proveedor 2", telefono: "999888777", correo: "prov2@example.com", ubicacion: "Cusco", rubro: "Construcción" },
    { id: 3, ruc: "20345678901", nombre: "Proveedor 3", telefono: "956789456", correo: "prov3@example.com", ubicacion: "Arequipa", rubro: "Alimentos" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProveedores(mockProveedores);
      setFilteredProveedores(mockProveedores);
      setLoading(false);
    }, 1000);
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

  const handleDeleteProveedor = (id) => {
    setProveedores(prev => prev.filter(proveedor => proveedor.id !== id));
    toast({
      title: "Proveedor eliminado",
      description: `El proveedor con ID ${id} ha sido eliminado.`,
      variant: "destructive",
    });
  };

  const navigateToPedidos = () => {
    // Lógica para redireccionar a la página de pedidos
    console.log("Navegando a pedidos...");
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
        <TableDemoProveedor proveedores={filteredProveedores} onProveedorDeleted={handleDeleteProveedor} />
      )}

      <Toaster />
    </div>
  );
}