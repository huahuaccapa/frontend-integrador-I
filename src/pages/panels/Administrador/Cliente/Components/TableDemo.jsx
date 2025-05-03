import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "../../../../../api/axios"; 

export function TableDemo({ clientes, onClienteDeleted }) {
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

  const handleDelete = async (id) => {
    try {
      await api.delete(`/clientes/${id}`);
      onClienteDeleted();
    } catch (error) {
      console.error("Error deleting cliente:", error);
    }
  };

  return (
    <Table className="mt-4">
      <TableCaption>Lista de Clientes Registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.nombre}</TableCell>
            <TableCell>{cliente.email}</TableCell>
            <TableCell>{cliente.telefono}</TableCell>
            {isAdmin && (
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="mr-2">
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(cliente.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}