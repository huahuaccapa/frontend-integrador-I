// components/TablaClientes.jsx
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditarClienteModal from "./EditarClienteModal"

export default function TablaClientes({ invoices, onEliminar }) {
  return (
    <Table>
      <TableCaption>Lista de Clientes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Nombre</TableHead>
          <TableHead>RUC</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.name}</TableCell>
            <TableCell>{invoice.RUC}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
            <TableCell className="text-right space-x-2">
              <EditarClienteModal cliente={invoice} />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onEliminar(invoice.id)}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
