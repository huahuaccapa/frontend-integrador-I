import React, { useState } from "react";
import {flexRender,getCoreRowModel,getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from "@tanstack/react-table";
import {  CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import * as XLSX from "xlsx";

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
    header: "Stock Disponible",
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

export function RITable() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});


  // Filtrar las ventas según el rango de fechas seleccionado
  const filteredData = React.useMemo(() => {
    return data.filter((inv) => {
      const invDate = new Date(inv.Fecha.split("/").reverse().join("-")); // "12/12/2025" => "2025-12-12"
      const afterStart = startDate ? invDate >= startDate : true;
      const beforeEnd = endDate ? invDate <= endDate : true;
      return afterStart && beforeEnd;
    });
  }, [startDate, endDate]);

  // Calcular totales filtrados
  const totalInventario = filteredData.reduce((acc, inv) => acc + inv.P_Venta, 0);
  const cantidadInventario = filteredData.length;

  const table = useReactTable({
    data: filteredData,
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
    Categoria: "Categoría",
    Proveedor: "Proveedor"
  };

  const dataExport = rows.map((row) => {
    const rowData = row.original;
    return {
      [headers.id]: rowData.id,
      [headers.Producto]: rowData.Producto,
      [headers.P_Venta]: rowData.P_Venta,
      [headers.Stock]: rowData.Stock,
      [headers.Categoria]: rowData.Categoria,
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
      {/* Encabezado con totales */}
      <div className="grid grid-cols-2 justify-center mb-4">
        <div className="text-black">
          <h1 className="font-bold">Costo de Inventario</h1>
          <p>S/. {totalInventario.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <h1 className="text-black font-bold">Cantidad de Productos en Inventario</h1>
          <p>{cantidadInventario}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 py-4">
        
        <Input
            placeholder="Filtrar por Proveedor..."
            value={table.getColumn("Proveedor")?.getFilterValue() ?? ""}
            onChange={(event) =>
            table.getColumn("Proveedor")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
        />

        <Input
            placeholder="Filtrar por Categoría..."
            value={table.getColumn("Categoria")?.getFilterValue() ?? ""}
            onChange={(event) =>
            table.getColumn("Categoria")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
        />



        {/* Rangos de fechas */}
        <div className="flex gap-5">
          <div className="bg-white rounded-lg">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Fecha inicio</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-white rounded-lg">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Fecha fin</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

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
    </div>
  );
}

