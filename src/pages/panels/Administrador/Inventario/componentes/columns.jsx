// src\pages\panels\Administrador\Inventario\componentes\columns.jsx

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Pencil, Trash, AlertTriangle, ArrowUpDown } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export function getColumns(onVer, onEditar, onEliminar) {
  return [
 
  
   {
    accessorKey: "id",
    header: "ID",
  },

 {
    accessorKey: "nombreProducto",
    header: "Nombre Producto",
  },

   {
    accessorKey: "tipoProducto",
    header: "Tipo de Producto",
    
  },  
  
  {
    accessorKey: "estadoStock",
    header: "Estado",
    
  },

  
  {
    accessorKey: "stock",
    header: () => <div className="text-center">Stock</div>,
    cell: ({ row }) => {
      const stock = row.getValue("stock")
      const isLow = stock <= 5

      if (isLow) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-1 text-red-600 font-semibold">
                  {stock}
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stock bajo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }

      return (
        <div className="text-center text-green-700">
          {stock}
        </div>
      )
    },
  },


  {
    accessorKey: "precio",
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("precio"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
   {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        const producto = row.original

        return (
          <div className="flex justify-center items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-blue-600"
                    onClick={() => onVer(producto)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ver</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-yellow-500"
                    onClick={() => onEditar(producto)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Editar</TooltipContent>
              </Tooltip>

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Eliminar</TooltipContent>
                </Tooltip>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará
                      permanentemente el producto <strong>{producto.producto}</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onEliminar(producto)}>
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipProvider>
          </div>
        )
      },
    },
]
}
