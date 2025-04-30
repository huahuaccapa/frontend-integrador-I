import React, { useMemo, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton'; 
import { useDebounce } from 'use-debounce';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CgChevronLeft, CgChevronRight, CgChevronDoubleLeft, CgChevronDoubleRight } from 'react-icons/cg';

const DataTable = ({ columns, data, fetchData, pagination, setPagination, searchableFields, totalPages, search, setSearch, searchFields, setSearchFields }) => {
  const [debouncedSearch] = useDebounce(search, 400);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataWrapper = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 0))
      await fetchData()
      setLoading(false)
    }
    fetchDataWrapper()
  }, [debouncedSearch, searchFields])

  const handleCheckboxChange = (field) => {
    setSearchFields((prev) => [field])
  };

  const fieldLabels = {
    name: 'Nombre',
    code: 'Código',
    full_name: 'Nombres',
    document_number: "Documento",
    programs_interesting: 'Programas que el docente puede dictar',
    status: 'Estado',
  };

  const table = useReactTable({
    data,
    columns,
    rowCount: data.length,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="p-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          {searchableFields && searchableFields.map((field) => (
            <label key={field} className="flex items-center gap-2">
              <Checkbox
                checked={searchFields?.includes(field) || false}
                onCheckedChange={() => handleCheckboxChange(field)}
              />
              <span>{fieldLabels[field] || field}</span>
            </label>
          ))}
        </div>
        <Input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="h-2" />
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
            {loading ? (
              // Mostrar Skeleton mientras se cargan los datos
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={columns.length}>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                  Sin Resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <CgChevronDoubleLeft />
        </button>
        <button
          className="border rounded p-1"
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
          disabled={pagination.pageIndex === 0}
        >
          <CgChevronLeft />
        </button>
        <button
          className="border rounded p-1"
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
          disabled={pagination.pageIndex >= totalPages - 1}
        >
          <CgChevronRight />
        </button>
        <button
          className="border rounded p-1"
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: totalPages - 1 }))}
          disabled={pagination.pageIndex >= totalPages - 1}
        >
          <CgChevronDoubleRight />
        </button>
        <span className="flex items-center gap-1">
          <div>Página</div>
          <strong>
            {pagination.pageIndex + 1} de {totalPages}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Ir a la Página:
          <Input
            className="border p-1 rounded w-16 ms-2"
            type="number"
            defaultValue={pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPagination((prev) => ({ ...prev, pageIndex: page }));
            }}
          />
        </span>
        <Select
          value={table.getState().pagination.pageSize}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Páginas</SelectLabel>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem value={pageSize} key={pageSize}>
                  Mostrar {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {loading && "Cargando..."}
      </div>
    </div>
  );
};

export default DataTable;
