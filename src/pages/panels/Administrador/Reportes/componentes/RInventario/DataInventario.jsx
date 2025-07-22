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
import { useNavigate } from "react-router-dom";
import ServiceReporte from "@/api/ServiceReporte";
import React, { useState, useEffect } from "react";
import Services from "@/api/Services";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "Producto", // Coincide con dataFormateada
    header: "Producto",
  },
  {
    accessorKey: "P_Venta", // Coincide con dataFormateada
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
    accessorKey: "Stock", // Coincide con dataFormateada
    header: "Stock Disponible",
  },
  {
    accessorKey: "Categoria", // Coincide con dataFormateada
    header: "Categoria",
  },
  {
    accessorKey: "Proveedor", // Coincide con dataFormateada
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalInventario, setTotalInventario] = useState(0);
  const [cantidadInventario, setCantidadInventario] = useState(0);
  const navigate = useNavigate();

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await Services.getAllProductos();
    const productos = response.data;

    // Calcula el total del inventario y cantidad de productos
    const total = productos.reduce((acc, producto) => acc + parseFloat(producto.precioVenta || 0), 0);
    const cantidad = productos.length;

    // Mapea los datos al formato esperado por la tabla
    const dataFormateada = productos.map(p => ({
      id: p.id,
      Producto: p.nombreProducto,
      P_Venta: p.precioVenta,
      Stock: p.stock,
      Categoria: p.categoria,
      Proveedor: p.proveedor?.nombre || "Sin proveedor" // Asegúrate que tu API tenga este campo
    }));

    setData(dataFormateada); // Cambiado de response.data a dataFormateada
    setTotalInventario(total);
    setCantidadInventario(cantidad);
    setError(null);
  } catch (err) {
    setError("Error al cargar los productos");
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};

    // Efecto para cargar datos cuando cambian las fechas
  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

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

    if (loading) {
    return <div>Cargando datos del inventario...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }


// Para exportar en XLSX
const exportToXLSX = () => {
  if (data.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const headers = {
    id: "ID",
    Producto: "Producto",
    P_Venta: "P. Venta (S/.)",
    Stock: "Stock Disponible",
    Categoria: "Categoría",
    Proveedor: "Proveedor"
  };

  const dataExport = data.map((item) => ({
    [headers.id]: item.id,
    [headers.Producto]: item.Producto,
    [headers.P_Venta]: item.P_Venta,
    [headers.Stock]: item.Stock,
    [headers.Categoria]: item.Categoria,
    [headers.Proveedor]: item.Proveedor,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
  
  // Nombre del archivo con fecha
  const fecha = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Inventario_${fecha}.xlsx`);
};


  return (
    <div className="w-full">
      {/* Encabezado con totales */}
      <div className="grid grid-cols-3 justify-center mb-4">
        <div className="text-black">
          <h1 className="font-bold">Costo de Inventario</h1>
          <p>S/. {totalInventario.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <h1 className="text-black font-bold">Cantidad de Productos en Inventario</h1>
          <p>{cantidadInventario}</p>
        </div>
        <div>
          <Button
              onClick={() => navigate("/dashboard/reportes/reporteStock")}
              className="bg-green-900 text-white font-bold text-xl hover:bg-yellow-100 hover:text-red-500"
            >
              Productos Bajos en Stock
            </Button></div>

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
