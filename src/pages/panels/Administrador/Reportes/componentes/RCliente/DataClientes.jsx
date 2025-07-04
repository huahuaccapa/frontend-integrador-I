import React, { useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/custom/button";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

// Datos
const data = [
  { Cliente: "Jorge Basadre", RUC: "10235465676565", Metodo: "YAPE", Fecha: "12/06/2025", Compras: 15 },
  { Cliente: "Ana Pérez", RUC: "10235465676566", Metodo: "Transferencia", Fecha: "10/06/2025", Compras: 8 },
  { Cliente: "Luis León", RUC: "10235465676567", Metodo: "Efectivo", Fecha: "08/06/2025", Compras: 12 },
];

// Columnas
export const columns = [
  { accessorKey: "RUC", header: "RUC" },
  { accessorKey: "Cliente", header: "Cliente" },
  { accessorKey: "Metodo", header: "Método de Pago" },
  { accessorKey: "Fecha", header: "Fecha de última Compra" },
  { accessorKey: "Compras", header: "Cant. de Compras" },
    {
    id: "Historial",
    enableHiding: false,
    header: () => <div className="text-center">Historial</div>,
    cell: ({ row }) => {
        const cliente = row.original; // cliente seleccionado
        const navigate = useNavigate(); // Mueve esto dentro si da error arriba

        return (
        <div className="flex justify-center gap-2">
            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => navigate("/dashboard/Reportes/HistorialCliente", { state: { cliente } })}
                >
                    <Eye className="h-4 w-4" />
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                <p>Ver Historial</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
        </div>
        );
    },
    }
];

export function RCTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState([]);
  const navigate = useNavigate();

  // Calcular cantidad de clientes únicos por RUC
  const cantidadClientes = new Set(data.map(cliente => cliente.RUC)).size;

  const table = useReactTable({
    data,
    columns,
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

  // Para exportar en XLSX
  const exportToXLSX = () => {
    const rows = table.getRowModel().rows;
  
    if (rows.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
  
    const headers = {
      RUC: "RUC",
      Cliente: "Cliente",
      Metodo: "Método de Pago",
      Fecha: "Fecha de ultima Compra",
      Compras: "Cantidad de Compras",
    };
  
    const dataExport = rows.map((row) => {
      const rowData = row.original;
      return {
        [headers.RUC]: rowData.RUC,
        [headers.Cliente]: rowData.Cliente,
        [headers.Metodo]: rowData.Metodo,
        [headers.Fecha]: rowData.Fecha,
        [headers.Compras]: rowData.Compras,
      };
    });
  
    const worksheet = XLSX.utils.json_to_sheet(dataExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte_Clientes");
    XLSX.writeFile(workbook, "RClientes.xlsx");
  };
  

  return (
    <div className="w-full">
      {/* Totales */}
      <div className="grid grid-cols-2 justify-center mb-4">
        <div>
          <h1 className="text-black font-bold">Número de Clientes Registrados</h1>
          <p>{cantidadClientes}</p>
        </div>
        <div> <Button className="bg-white text-black font-bold border-4 border-green-500 hover:bg-green-100"
            onClick={exportToXLSX}>Exportar XLSX</Button></div>
      </div>

      {/* Filtro por cliente */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4">
        <Input
          placeholder="Filtrar por cliente..."
          value={table.getColumn("Cliente")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("Cliente")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      {/* Tabla */}
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

    </div>
  );
}
