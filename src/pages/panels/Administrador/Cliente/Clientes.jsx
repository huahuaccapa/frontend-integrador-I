import { useState, useEffect } from 'react';
import { TableDemo } from './Components/TableDemo';
import { SheetDemo } from './Components/SheetDemo';
import api from "@/api/axios";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

export function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Obteniendo lista de clientes...");
      const response = await api.get('/clientes');
      
      if (response.data && response.data.length > 0) {
        console.log("Clientes recibidos:", response.data);
        setClientes(response.data);
      } else {
        console.warn("La respuesta no contiene datos");
        setClientes([]);
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

  return (
    <div className="p-4">
      <SheetDemo onClienteAdded={fetchClientes} />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando clientes...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border rounded">
          {error} - <button onClick={fetchClientes} className="text-blue-500">Reintentar</button>
        </div>
      ) : clientes.length === 0 ? (
        <div className="text-center p-8">
          <p>No hay clientes registrados</p>
        </div>
      ) : (
        <TableDemo clientes={clientes} onClienteDeleted={fetchClientes} />
      )}
      
      <Toaster />
    </div>
  );
}