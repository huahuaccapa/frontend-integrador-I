import * as React from "react"
import {Sheet,SheetClose,SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {Banknote, CreditCard} from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";



export function Metodo({ open, onOpenChange, carrito = [], cliente = {}, total = 0 }) {
    
const navigate = useNavigate();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] bg-green-950 p-4 text-white">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-white">Método de Pago</SheetTitle>
          <Separator className="bg-white/30 my-2" />
        </SheetHeader>

        {/* Métodos de pago */}
        <div className="space-y-3 py-2 grid grid-cols-3 justify-items-center ">
          <Button className="bg-green-800 hover:bg-white hover:text-black w-15 h-12">
            <Banknote className="w-14 h-14" />
          </Button>
          <Button className="bg-green-800 hover:bg-white hover:text-black w-15 h-12">
            <img src="https://marketing-peru.beglobal.biz/wp-content/uploads/2025/01/logo-yape-color-negro.png" className="w-10 h-10" />
          </Button>
          <Button className="bg-green-800 hover:bg-white hover:text-black w-15 h-12">
            <CreditCard className="w-14 h-14" />
          </Button>
          <Label>Efectivo</Label>
          <Label>App</Label>
          <Label>Tarjeta</Label>
        </div>

        <Separator className="bg-white/30 my-2" />

        {/* Info del cliente */}
        <div className="text-sm mb-4">
          <h1 className="font-semibold">Cliente:</h1>
          <p>{cliente.nombre} {cliente.apellido}</p>
          <h1 className="font-semibold">DNI/RUC:</h1>
          <p>{cliente.documento}</p>
        </div>

        {/* Resumen tipo ticket */}
        <div className="bg-white text-black p-4 rounded-lg mt-6 text-sm font-mono shadow-md">
          <h4 className="font-bold mb-2 text-center">RESUMEN DE COMPRA</h4>
          <div className="divide-y divide-dashed divide-gray-400">
            {carrito.map((item, index) => (
              <div key={index} className="py-1 flex justify-between">
                <span>{item.nombre} x{item.cantidad}</span>
                <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 font-bold text-base border-t border-gray-400 pt-2">
            <span>Total:</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Botones */}
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <div className="grid grid-cols-2 space-x-4">
              <Button className="hover:bg-white hover:text-black" onClick={() => {
                toast.success("Venta procesada de forma exitosa",{
                    duration: 3000,
                    position:"top-center",})
                onOpenChange(false) }}>Pagar</Button>
                 <div>
                    <Button
                        className="hover:bg-white hover:text-black"
                        onClick={() => {
                        const confirmCancel = window.confirm("¿Estás seguro de cancelar la compra?");
                        if (confirmCancel) {
                            onOpenChange(false); // Cierra el modal
                            navigate("/dashboard/ventas"); // Redirige a ventas
                        }
                        }}
                    >
                        Cancelar
                    </Button>
                </div>

            </div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
