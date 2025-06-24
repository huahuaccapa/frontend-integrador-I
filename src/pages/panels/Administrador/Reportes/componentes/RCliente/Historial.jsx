import React, { useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/custom/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DetalleCompraModal } from "./ModalHistorial"
import * as XLSX from "xlsx";

// Datos
const data = [
  { Nro_Compra: "00123", Cant_Prod: 3 , Metodo: "YAPE", Fecha: "12/06/2025" },
  { Nro_Compra: "00122", Cant_Prod: 10 , Metodo: "YAPE", Fecha: "15/06/2025" },
  { Nro_Compra: "00124", Cant_Prod: 20 , Metodo: "YAPE", Fecha: "15/06/2025" },
];

export function HistorialCliente() {
  const { state } = useLocation();
  const cliente = state?.cliente;
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);

  const handleOpenModal = (compra) => {
    setSelectedCompra(compra);
    setModalOpen(true);
  };

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "Nro_Compra", header: "Nro. Compra" },
      { accessorKey: "Cant_Prod", header: "Cant. Productos" },
      { accessorKey: "Metodo", header: "Método de Pago" },
      { accessorKey: "Fecha", header: "Fecha de última Compra" },
      {
        id: "Detalles",
        enableHiding: false,
        header: () => <div className="text-center">Detalles</div>,
        cell: ({ row }) => {
          const compra = row.original;

          return (
            <div className="flex justify-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleOpenModal(compra)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver Detalles</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      },
    ],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (!cliente) {
    return <p className="p-4 text-red-500">No se encontró información del cliente.</p>;
  }

   // Para exportar en XLSX
    const exportToXLSX = () => {
      const rows = table.getRowModel().rows;
    
      if (rows.length === 0) {
        alert("No hay datos para exportar.");
        return;
      }
    
      const headers = {
        Nro_Compra: "Nro. Compra",
        Cant_Prod: "Cant. Productos",
        Metodo: "Método de Pago",
        Fecha: "Fecha de ultima Compra",
      };
    
      const dataExport = rows.map((row) => {
        const rowData = row.original;
        return {
          [headers.Nro_Compra]: rowData.Nro_Compra,
          [headers.Cant_Prod]: rowData.Cant_Prod,
          [headers.Metodo]: rowData.Metodo,
          [headers.Fecha]: rowData.Fecha,
        };
      });
    
      const worksheet = XLSX.utils.json_to_sheet(dataExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Historial_Cliente");
      XLSX.writeFile(workbook, `RHistorial_${cliente.Cliente}.xlsx`);
    };

  return (
    <div className="p-4 space-y-4">
      <h1 className="font-bold text-black text-2xl mb-4">Reportes / Clientes</h1>
      <Separator className="my-2" />
      <div className="grid grid-cols-2 gap-4">
        <div className="text-xl font-bold text-gray-800">Historial de Compras de: {cliente.Cliente}</div>
        <div><strong>RUC:</strong> {cliente.RUC}</div>
        <div className="font-bold text-black text-xl">Registro de Compras</div>
        <div> <Button className="bg-white text-black font-bold border-4 border-green-500 hover:bg-green-100"
            onClick={exportToXLSX}>Exportar XLSX</Button></div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Button onClick={() => navigate(-1)}>Volver</Button>

      {/* Modal */}
      <DetalleCompraModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        compra={selectedCompra}
        cliente={cliente}
      />
    </div>
  );
}
