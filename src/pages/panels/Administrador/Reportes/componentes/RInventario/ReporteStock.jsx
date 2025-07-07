import React, { useState,useEffect } from "react";

import {flexRender,getCoreRowModel,getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from "@tanstack/react-table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import * as XLSX from "xlsx";
import { useLocation, useNavigate } from "react-router-dom";
import Services from "@/api/Services";


// Columnas
export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nombreProducto",
    header: "Producto",
  },
  {
    accessorKey: "precioVenta",
    header: () => <div className="text-right">P. Venta</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("precioVenta"));
      const formatted = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
   {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
  },
  {
    accessorKey: "Proveedor",
    header: "Proveedor",
  },
];

export function ReporteStock() {

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Obtener productos con stock bajo
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Services.obtenerProductosConStockBajo();
   
      // Mapea los datos si es necesario
      const datosFormateados = response.data.map(item => ({
        id: item.id,
        nombreProducto: item.nombreProducto,
        precioVenta: item.precioVenta,
        stock: item.stock,
        categoria: item.categoria
      }));
      
      setData(datosFormateados);
      setError(null);
    } catch (error) {
      console.error("Error al obtener productos con stock bajo:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
 
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
  if (data.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const dataExport = data.map((item) => ({
    "ID": item.id,
    "Producto": item.nombreProducto, // Cambiado de item.Producto
    "Precio Venta": item.precioVenta, // Cambiado de item.P_Venta
    "Stock": item.stock,
    "Categoría": item.categoria,
    // Elimina Proveedor si no está en los datos
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Bajo");
  XLSX.writeFile(workbook, "productos_stock_bajo.xlsx");
};


  return (
    <div className="w-full">
     
     <h1 className="font-bold text-black text-2xl mb-4">Reportes / Prodcutos de bajo Stock</h1>
      <Separator className="my-2" />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 py-4">
        
        <Input
  placeholder="Filtrar por Producto..."
  value={table.getColumn("nombreProducto")?.getFilterValue() ?? ""}
  onChange={(event) =>
    table.getColumn("nombreProducto")?.setFilterValue(event.target.value)
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
