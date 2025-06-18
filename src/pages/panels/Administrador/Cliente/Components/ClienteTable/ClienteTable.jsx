//src\pages\panels\Administrador\Cliente\Components\ClienteTable\ClienteTable.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table";
import {useReactTable,getCoreRowModel,getPaginationRowModel,flexRender} from "@tanstack/react-table";
import axios from "axios";
import { useForm } from "react-hook-form";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Eye, Pencil, Trash, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export  function ClienteTable({ clientes, onClienteDeleted }) {
  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = React.useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "nombre",
        cell: ({ row }) => row.original.nombre || "-",
      },
      {
        header: "Apellidos",
        accessorKey: "apellidos",
        cell: ({ row }) => row.original.apellidos || "-",
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => row.original.email || "-",
      },
      {
        header: "Teléfono",
        accessorKey: "telefono",
        cell: ({ row }) => row.original.telefono || "-",
      },
      {
        header: "RUC/DNI",
        accessorKey: "identificacion",
        cell: ({ row }) => row.original.identificacion || "-",
      },
      ...(isAdmin
        ? [
            {
              header: "Acciones",
              id: "acciones",
              cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                  <EditClienteDialog
                    cliente={row.original}
                    onClienteUpdated={onClienteDeleted}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-500 hover:text-white"onClick={() => handleDelete(row.original.id)}>
         
                   <Trash className="h-4 w-4" />
                    
                  </Button>
                </div>
              ),
            },
          ]
        : []),
    ],
    [isAdmin, onClienteDeleted]
  );

  const table = useReactTable({
    data: clientes,
    columns,
    pageCount: Math.ceil(clientes.length / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const handleDelete = async (id) => {
    try {
      const confirmar = window.confirm("¿Estás seguro de eliminar este cliente?");
      if (!confirmar) return;

      await axios.delete(`http://localhost:8080/api/clientes/${id}`);
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
      });
      onClienteDeleted();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Table className="mt-4">
        <TableCaption>Lista de Clientes Registrados ({clientes.length})</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div className="flex items-center justify-between px-2 mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {clientes.length} clientes
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditClienteDialog({ cliente, onClienteUpdated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      direccion: cliente.direccion,
      email: cliente.email,
      telefono: cliente.telefono,
      identificacion: cliente.identificacion,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/clientes/${cliente.id}`,
        {
          nombre: data.nombre,
          apellidos: data.apellidos || "",
          direccion: data.direccion || "",
          email: data.email,
          telefono: data.telefono || "",
          identificacion: data.identificacion || "",
        }
      );

      if (response.status === 200) {
        toast({
          title: "Éxito",
          description: "Cliente actualizado correctamente",
        });
        onClienteUpdated();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"
                    variant="ghost"
                    className="hover:bg-yellow-300 hover:text-black">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-yellow-100'>
        <DialogHeader>
          <DialogTitle className='text-green-800 font-bold'>Editar Cliente</DialogTitle>
          <Separator className='my-4 bg-black'/>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {[
            { name: "nombre", label: "Nombre", required: true },
            { name: "apellidos", label: "Apellidos" },
            { name: "direccion", label: "Direccion" },
            { name: "email", label: "Email", required: true, type: "email" },
            { name: "telefono", label: "Teléfono" },
            { name: "identificacion", label: "RUC/DNI" },
          ].map(({ name, label, required, type }) => (
            <div
              key={name}
              className="grid grid-cols-4 items-center gap-4"
            >
              <Label htmlFor={name} className="text-right font-bold">
                {label}
              </Label>
              <Input
                id={name}
                type={type || "text"}
                {...register(name, {
                  required: required && "Este campo es obligatorio",
                  pattern:
                    name === "email"
                      ? {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Ingrese un email válido",
                        }
                      : undefined,
                })}
                className="col-span-3 bg-white"
              />
              {errors[name] && (
                <span className="col-span-4 text-right text-sm text-red-500">
                  {errors[name].message}
                </span>
              )}
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
