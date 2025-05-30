import { Button } from "@/components/ui/button";

export function getColumns() {
  return [
    {
      accessorKey: "nombre",
      header: "Producto",
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      cell: ({ row }) => row.getValue("detalle") || "—",
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
    },
    {
      accessorKey: "precio",
      header: () => <div className="text-right">Precio Unitario</div>,
      cell: ({ row }) => {
        const precio = parseFloat(row.getValue("precio"));
        const formatted = new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: "PEN",
        }).format(precio);
        return <div className="text-right">{formatted}</div>;
      },
    },
    {
      accessorKey: "subtotal",
      header: () => <div className="text-right">Subtotal</div>,
      cell: ({ row }) => {
        const precio = parseFloat(row.original.precio);
        const cantidad = parseInt(row.original.cantidad);
        const subtotal = precio * cantidad;

        const formatted = new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: "PEN",
        }).format(subtotal);
        return <div className="text-right font-semibold">{formatted}</div>;
      },
    },
  ];
}
