//src\pages\panels\Administrador\Inventario\componentes\columns.jsx
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function getColumns(onVer, onEditar, onEliminar) {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nombreProducto",
      header: "Nombre",
    },
    {
      accessorKey: "categoria",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("categoria")?.toLowerCase() || 'N/A'}
        </Badge>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado");
        let variant;
        switch(estado) {
          case 'OPTIMO': variant = 'default'; break;
          case 'MEDIO': variant = 'secondary'; break;
          case 'BAJO': variant = 'destructive'; break;
          default: variant = 'outline';
        }
        return (
          <Badge variant={variant} className="capitalize">
            {estado?.toLowerCase() || 'N/A'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "stock",
      header: () => <div className="text-center">Stock</div>,
      cell: ({ row }) => {
        const stock = row.getValue("stock");
        const isLow = stock <= 5;

        return (
          <div className={`text-center font-medium ${
            isLow ? 'text-red-600' : 'text-green-600'
          }`}>
            {stock}
            {isLow && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertTriangle className="h-4 w-4 inline-block ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Stock bajo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "precioVenta",
      header: () => <div className="text-right">Precio</div>,
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
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        const producto = row.original;

        return (
          <div className="flex justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => onVer(producto)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalles</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-yellow-50 hover:text-yellow-600"
                    onClick={() => onEditar(producto)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-50 hover:text-red-600"
                    onClick={() => onEliminar(producto)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
}