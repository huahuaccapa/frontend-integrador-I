import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DetalleCompraModal({ open, onClose, compra, cliente }) {
  if (!compra) return null;

  const dataConSubtotal = useMemo(() => {
    const detalles = compra?.rawData?.detalles || [];
    return detalles.map((item) => ({
      Producto: item.producto?.nombreProducto || "Desconocido",
      Detalle: item.producto?.descripcion || "—",
      Cantidad: item.cantidad,
      Unidad: item.precioUnitario,
      Subtotal: item.subtotal,
    }));
  }, [compra]);

  const columns = useMemo(
    () => [
      { accessorKey: "Producto", header: "Producto" },
      { accessorKey: "Detalle", header: "Detalle" },
      { accessorKey: "Cantidad", header: "Cantidad" },
      {
        accessorKey: "Unidad",
        header: () => <div className="text-right">P. Unitario</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("Unidad"));
          const formatted = new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
          }).format(amount);
          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "Subtotal",
        header: () => <div className="text-right">Subtotal</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("Subtotal"));
          const formatted = new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
          }).format(amount);
          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: dataConSubtotal,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Detalle de la Compra #{compra.Nro_Compra}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Cliente:</strong> {cliente?.nombre}
          </p>
          <p>
            <strong>RUC:</strong> {cliente?.ruc || cliente?.identificacion}
          </p>
          <p>
            <strong>Método de Pago:</strong> {compra.Metodo}
          </p>
          <p>
            <strong>Fecha:</strong> {compra.Fecha}
          </p>
        </div>

        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
