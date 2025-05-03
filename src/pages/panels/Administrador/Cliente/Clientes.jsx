import { useState, useEffect } from 'react';
import { TableDemo } from './Components/TableDemo';
import { SheetDemo } from './Components/SheetDemo';
import api from "@/api/axios";  // Cambia esta línea

export function Clientes() {
  const [clientes, setClientes] = useState([]);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  useEffect(() => { fetchClientes(); }, []);

  return (
    <div className="p-4">
      <SheetDemo onClienteAdded={fetchClientes} />
      <TableDemo clientes={clientes} onClienteDeleted={fetchClientes} />
    </div>
  );
}