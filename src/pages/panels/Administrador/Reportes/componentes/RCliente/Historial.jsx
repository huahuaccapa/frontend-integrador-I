import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/custom/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DetalleCompraModal } from "./ModalHistorial";
import * as XLSX from "xlsx";
import ServiceVentas from "@/api/ServiceVentas";

export function HistorialCliente() {
  const { state } = useLocation();
  const cliente = state?.cliente;
  const navigate = useNavigate();

  const [ventas, setVentas] = useState([]);
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

 useEffect(() => {
  const fetchVentas = async () => {
    try {
      const response = await ServiceVentas.getAllVentas();
      const todasVentas = response.data;

      console.log("Cliente recibido:", cliente);
      console.log("Ventas totales:", todasVentas);

      if (!cliente?.ruc) return;

      const ventasCliente = todasVentas
        .filter((venta) => {
          const match = venta.cliente?.identificacion === cliente.ruc;
          console.log(
            `¿Venta pertenece al cliente? ${match} → Venta ID: ${venta.id}, Identificación: ${venta.cliente?.identificacion}`
          );
          return match;
        })
        .map((venta, index) => ({
          Nro_Compra: String(index + 1).padStart(5, "0"),
          Cant_Prod: venta.detalles.reduce((acc, d) => acc + d.cantidad, 0),
          Metodo: venta.metodoPago,
          Fecha: new Date(venta.fechaVenta).toLocaleDateString(),
          rawData: venta,
        }));

      setVentas(ventasCliente);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  };

  fetchVentas();
}, [cliente]);


  const table = useReactTable({
    data: ventas,
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
    return (
      <p className="p-4 text-red-500">
        No se encontró información del cliente.
      </p>
    );
  }

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
      Fecha: "Fecha de última Compra",
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
    XLSX.writeFile(workbook, `RHistorial_${cliente.nombre}.xlsx`);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="font-bold text-black text-2xl mb-4">
        Reportes / Clientes
      </h1>
      <Separator className="my-2" />
      <div className="grid grid-cols-2 gap-4">
        <div className="text-xl font-bold text-gray-800">
          Historial de Compras de: {cliente.nombre}
        </div>
        <div>
          <strong>RUC:</strong> {cliente.ruc || cliente.identificacion}
        </div>
        <div className="font-bold text-black text-xl">Registro de Compras</div>
        <div>
          <Button
            className="bg-white text-black font-bold border-4 border-green-500 hover:bg-green-100"
            onClick={exportToXLSX}
          >
            Exportar XLSX
          </Button>
        </div>
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
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Button onClick={() => navigate(-1)}>Volver</Button>

      <DetalleCompraModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        compra={selectedCompra}
        cliente={cliente}
      />
    </div>
  );
}
