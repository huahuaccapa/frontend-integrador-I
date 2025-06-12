import * as React from "react"
import { useState, useEffect } from "react"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Services from "@/api/Services"

export function Catalogo({ onAbrir, carrito, agregarAlCarrito }) {
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [productos, setProductos] = useState([])
  const productosPorPagina = 8

  useEffect(() => {
    Services.getAllProductos()
      .then((response) => {
        // Asegurarse que cada producto tenga su imagen correctamente formada
        const productosConImagenes = response.data.map(producto => ({
          ...producto,
          imagen: producto.imagenes && producto.imagenes.length > 0 
            ? producto.imagenes[0] // Tomar la primera imagen
            : "/placeholder-product.png" // Imagen por defecto si no hay
        }));
        setProductos(productosConImagenes)
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error)
      })
  }, [])

  const productosFiltrados = productos.filter((p) =>
    p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina)
  const inicio = (paginaActual - 1) * productosPorPagina
  const productosPaginados = productosFiltrados.slice(inicio, inicio + productosPorPagina)

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
    }
  }

  return (
    <div className="px-10 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Catálogo de Productos</h2>
      <Separator className="my-4" />

      <div className="flex items-center gap-4 w-full md:w-2/3 mb-6">
        <Input
          type="text"
          placeholder="Ingrese el producto a buscar"
          className="flex-1"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPaginaActual(1)
          }}
        />
        <Button onClick={onAbrir} variant="default" className="relative rounded-full">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Procesar Compra
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {carrito.length}
            </span>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productosPaginados.map((producto) => (
          <Card
            key={producto.id}
            className="transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <CardContent className="p-4">
              <div className="h-48 w-full mb-3 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                <img
                  src={producto.imagen}
                  alt={producto.nombreProducto}
                  className="object-contain h-full w-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-product.png";
                  }}
                />
              </div>
              <p className="font-medium text-gray-800">{producto.nombreProducto}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-green-600 font-bold">${producto.precioVenta}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-black hover:text-green-600"
                        onClick={() => agregarAlCarrito(producto)}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Agregar al carrito</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => cambiarPagina(paginaActual - 1)} />
            </PaginationItem>
            {[...Array(totalPaginas)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={paginaActual === i + 1}
                  onClick={() => cambiarPagina(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPaginas > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => cambiarPagina(paginaActual + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
