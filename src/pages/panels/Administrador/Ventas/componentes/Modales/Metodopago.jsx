import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Banknote, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ServiceVentas from "@/api/ServiceVentas";

export function Metodo({ open, onOpenChange, carrito = [], cliente = {}, total = 0 }) {
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = React.useState("EFECTIVO");

   const handlePagar = async () => {
    // Validación del cliente
    if (!cliente?.id) {
      toast.error("Debe seleccionar un cliente antes de pagar", {
        duration: 3000,
        position: "top-center"
      });
      return;
    }

    // Validación del carrito
    if (carrito.length === 0) {
      toast.error("El carrito está vacío", {
        duration: 3000,
        position: "top-center"
      });
      return;
    }

    try {
      const venta = {
        clienteId: cliente.id,
        metodoPago: metodoPago,
        tipoComprobante: "FACTURA",
        montoPagado: total,
        total: total,
        detalles: carrito.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
          precioUnitario: item.precio
        }))
      };

      await ServiceVentas.crearVenta(venta);

      toast.success("Venta procesada exitosamente", {
        duration: 3000,
        position: "top-center"
      });

      onOpenChange(false);
      navigate("/dashboard/ventas");
    } catch (error) {
      toast.error("Error al procesar la venta");
      console.error(error);
    }
  };

   const isDisabled = !cliente?.id || carrito.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[400px] bg-green-950 p-4 text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-white">
            Método de Pago
          </SheetTitle>
          <Separator className="bg-white/30 my-2" />
        </SheetHeader>

        {/* Métodos de pago */}
        <div className="space-y-3 py-2 grid grid-cols-3 justify-items-center">
          <Button
            className={`bg-green-800 hover:bg-white hover:text-black w-15 h-12 ${
              metodoPago === "EFECTIVO" ? "ring-2 ring-white" : ""
            }`}
            onClick={() => setMetodoPago("EFECTIVO")}
          >
            <Banknote className="w-14 h-14" />
          </Button>
          <Button
            className={`bg-green-800 hover:bg-white hover:text-black w-15 h-12 ${
              metodoPago === "APP" ? "ring-2 ring-white" : ""
            }`}
            onClick={() => setMetodoPago("APP")}
          >
            <img
              src="https://marketing-peru.beglobal.biz/wp-content/uploads/2025/01/logo-yape-color-negro.png"
              className="w-10 h-10"
              alt="Yape"
            />
          </Button>
          <Button
            className={`bg-green-800 hover:bg-white hover:text-black w-15 h-12 ${
              metodoPago === "TARJETA" ? "ring-2 ring-white" : ""
            }`}
            onClick={() => setMetodoPago("TARJETA")}
          >
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
              <Button
                className="hover:bg-white hover:text-black"
                onClick={handlePagar}
              >
                Pagar
              </Button>
              <div>
                <Button
                  className="hover:bg-white hover:text-black"
                  onClick={() => {
                    const confirmCancel = window.confirm("¿Estás seguro de cancelar la compra?");
                    if (confirmCancel) {
                      onOpenChange(false);
                      navigate("/dashboard/ventas");
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
