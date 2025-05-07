import { useState, useEffect } from 'react';
import { TableDemo } from './Components/TableDemo';
import { SheetDemo } from './Components/SheetDemo';
import api from "@/api/axios";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Obteniendo lista de clientes...");
      const response = await api.get('/clientes');
      
      if (response.data && response.data.length > 0) {
        console.log("Clientes recibidos:", response.data);
        setClientes(response.data);
        setFilteredClientes(response.data);
      } else {
        console.warn("La respuesta no contiene datos");
        setClientes([]);
        setFilteredClientes([]);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setError("Error al cargar clientes");
      toast({
        title: "Error",
        description: "No se pudo obtener la lista de clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchClientes();
  }, []);

  // Función para filtrar clientes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.identificacion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClientes(filtered);
    }
  }, [searchTerm, clientes]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <SheetDemo onClienteAdded={fetchClientes} />
        <Input
          type="text"
          placeholder="Buscar clientes..."
          className="w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando clientes...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border rounded">
          {error} - <button onClick={fetchClientes} className="text-blue-500">Reintentar</button>
        </div>
      ) : filteredClientes.length === 0 ? (
        <div className="text-center p-8">
          <p>No hay clientes {searchTerm ? 'que coincidan con la búsqueda' : 'registrados'}</p>
        </div>
      ) : (
        <TableDemo clientes={filteredClientes} onClienteDeleted={fetchClientes} />
      )}
      
      <Toaster />
    </div>
  );
}