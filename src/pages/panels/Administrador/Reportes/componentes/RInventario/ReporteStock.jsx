import React, { useState } from "react";
import {flexRender,getCoreRowModel,getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from "@tanstack/react-table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import * as XLSX from "xlsx";
import { useLocation, useNavigate } from "react-router-dom";


// Datos de ejemplo
const data = [
  {
    id: "P001",
    Producto: "Pantalla",
    P_Venta: 316,
    Stock: 2,
    Stock_min: 1,
    Fecha: "12/06/2025",
    Proveedor: "Italic SAC",
    Categoria: "Accesesorio"
  },
  {
    id: "P002",
    Producto: "Pantalla 3",
    P_Venta: 316,
    Stock: 2,
    Stock_min: 1,
    Fecha: "12/06/2025",
    Proveedor: "Italic SAC",
    Categoria: "Repuesto"
  },
  {
    id: "P003",
    Producto: "Pantalla4",
    P_Venta: 316,
    Stock: 2,
    Stock_min: 1,
    Fecha: "12/06/2025",
    Proveedor: "Italic SAC",
    Categoria: "Repuesto"
  },
  {
    id: "P004",
    Producto: "Pantalla4",
    P_Venta: 316,
    Stock: 2,
    Stock_min: 1,
    Fecha: "14/06/2025",
    Proveedor: "Italic3 SAC",
    Categoria: "Accesesorio"
  },
  
];

// Columnas
export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "Producto",
    header: "Producto",
  },
  {
    accessorKey: "P_Venta",
    header: () => <div className="text-right">P. Venta</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("P_Venta"));
      const formatted = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
   {
    accessorKey: "Stock",
    header: "Stock",
  },
  {
    accessorKey: "Categoria",
    header: "Categoria",
  },
  {
    accessorKey: "Proveedor",
    header: "Proveedor",
  },
];

export function ReporteStock() {

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
   const navigate = useNavigate();


 
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
    id: "ID",
    Producto: "Producto",
    P_Venta: "P. Venta",
    Stock: "Stock Disponible",
    Proveedor: "Proveedor"
  };

  const dataExport = rows.map((row) => {
    const rowData = row.original;
    return {
      [headers.id]: rowData.id,
      [headers.Producto]: rowData.Producto,
      [headers.P_Venta]: rowData.P_Venta,
      [headers.Stock]: rowData.Stock,
      [headers.Proveedor]: rowData.Proveedor,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dataExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
  XLSX.writeFile(workbook, "inventario.xlsx");
};


  return (
    <div className="w-full">
     
     <h1 className="font-bold text-black text-2xl mb-4">Reportes / Prodcutos de bajo Stock</h1>
      <Separator className="my-2" />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 py-4">
        
        <Input
            placeholder="Filtrar por Producto..."
            value={table.getColumn("Producto")?.getFilterValue() ?? ""}
            onChange={(event) =>
            table.getColumn("Producto")?.setFilterValue(event.target.value)
            }
            className="w-1/2"
        />


        <div>
            <Button className="bg-white text-black font-bold border-4 border-green-500 hover:bg-green-100"
            onClick={exportToXLSX}>Exportar XLSX</Button>
        </div>
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
                  No hay resultados en este rango.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button onClick={() => navigate(-1)} className="my-4">Volver</Button>
    </div>
  );
}

