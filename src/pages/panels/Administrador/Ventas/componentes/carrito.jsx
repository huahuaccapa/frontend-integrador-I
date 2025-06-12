import * as React from "react"
import { CircleMinus, CirclePlus, Trash } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

export default function Carrito({ open, onOpenChange, carrito, onRemove, onIncrease, onDecrease }) {
  const subtotal = carrito.reduce(
    (total, item) => total + item.precioVenta * item.cantidad,
    0
  )
  const navigate = useNavigate()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] bg-green-950 p-4 text-white">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-white">Carrito de Compras</SheetTitle>
          <Separator className="bg-white/30 my-2" />
        </SheetHeader>

        <div className="space-y-6 py-2">
          {carrito.length === 0 ? (
            <p className="text-white">Tu carrito está vacío.</p>
          ) : (
            carrito.map((item, index) => (
              <div key={index} className="border-b border-white/20 pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
                    <img
                      src={item.imagen}
                      alt={item.nombreProducto}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium truncate">{item.nombreProducto}</h3>
                    <p className="text-lg font-semibold">S/ {item.precioVenta}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDecrease(index)}
                        className="hover:bg-black hover:text-green-500"
                      >
                        <CircleMinus className="h-5 w-5" />
                      </Button>
                      <span className="text-white">{item.cantidad}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onIncrease(index)}
                        className="hover:bg-black hover:text-green-500"
                      >
                        <CirclePlus className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(index)}
                      className="text-white hover:text-red-600 p-0 flex items-center gap-1"
                    >
                      <Trash className="h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white text-black p-4 rounded-lg mt-6">
          <h4 className="font-bold">RESUMEN DE COMPRA</h4>
          <p>Tienes {carrito.length} producto(s) en tu carrito</p>
          <div className="flex justify-between mt-2">
            <span className="font-semibold">Subtotal:</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
        </div>

        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button
              onClick={() =>
                navigate("/dashboard/ventas/detalle", {
                  state: { productos: carrito }
                })
              }
              className="bg-green-700 hover:bg-green-600 w-full justify-between text-white font-semibold"
            >
              COMPRAR <span>SubTotal S/ {subtotal.toFixed(2)}</span>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
