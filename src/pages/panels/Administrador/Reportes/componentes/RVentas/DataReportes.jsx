import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CalendarIcon, Printer } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import ServiceVentas from "@/api/ServiceVentas";

// Columnas
export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "cliente", // Ajustado para coincidir con el backend
    header: "Cliente",
  },
  {
    accessorKey: "metodoPago", // Ajustado para coincidir con el backend
    header: "Método de Pago",
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "fecha", // Ajustado para coincidir con el backend
    header: "Fecha",
    cell: ({ row }) => {
      const fecha = row.getValue("fecha");
      return format(new Date(fecha), "dd/MM/yyyy");
    },
  },
];

export function RVTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Cargar datos del backend
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await ServiceVentas.getAllVentas();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar las ventas:", error);
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  // Filtrar las ventas según el rango de fechas seleccionado
  const filteredData = React.useMemo(() => {
    return data.filter((venta) => {
      const ventaDate = new Date(venta.fecha);
      const afterStart = startDate ? ventaDate >= startDate : true;
      const beforeEnd = endDate ? ventaDate <= endDate : true;
      return afterStart && beforeEnd;
    });
  }, [data, startDate, endDate]);

  // Calcular totales filtrados
  const totalVentas = filteredData.reduce((acc, venta) => acc + venta.total, 0);
  const cantidadVentas = filteredData.length;

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

  // Función para imprimir la tabla
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Ventas</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .text-right { text-align: right; }
            .header { margin-bottom: 20px; }
            .totals { margin-bottom: 20px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <h1 class="header">Reporte de Ventas</h1>
          <div class="totals">
            <div>
              <strong>Ingreso de ventas:</strong> S/. ${totalVentas.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </div>
            <div>
              <strong>Número de Ventas Totales:</strong> ${cantidadVentas}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                ${table.getHeaderGroups()[0].headers.map(header => 
                  `<th>${header.column.columnDef.header}</th>`
                ).join("")}
              </tr>
            </thead>
            <tbody>
              ${table.getRowModel().rows.map(row => `
                <tr>
                  ${row.getVisibleCells().map(cell => `
                    <td class="${cell.column.id === "total" ? "text-right" : ""}">
                      ${cell.column.id === "total" ? 
                        new Intl.NumberFormat("es-PE", {
                          style: "currency",
                          currency: "PEN",
                        }).format(cell.getValue()) :
                        (cell.column.id === "fecha" ? 
                          format(new Date(cell.getValue()), "dd/MM/yyyy") : 
                          cell.getValue())
                      }
                    </td>
                  `).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <div>Cargando ventas...</div>;
  }

  return (
    <div className="w-full">
      {/* Encabezado con totales */}
      <div className="grid grid-cols-2 justify-center mb-4">
        <div className="text-black">
          <h1 className="font-bold">Ingreso de ventas</h1>
          <p>S/. {totalVentas.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <h1 className="text-black font-bold">Número de Ventas Totales</h1>
          <p>{cantidadVentas}</p>
        </div>
      </div>

      {/* Filtros y botón de impresión */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4">
        <Input
          placeholder="Filtrar por cliente..."
          value={table.getColumn("cliente")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("cliente")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Rangos de fechas */}
        <div className="flex gap-4">
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

          {/* Botón de impresión */}
          <Button onClick={handlePrint} className="ml-auto">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
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