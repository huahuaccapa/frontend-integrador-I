//src\pages\panels\Administrador\Ventas\ventas.jsx
import * as React from "react"
import { useState } from "react"
import { Catalogo } from "./componentes/Catalogo"
import Carrito from "./componentes/carrito"

export function Ventas() {
  const [open, setOpen] = useState(false)
  const [carrito, setCarrito] = useState([])

  // Función para agregar productos al carrito
const agregarProductoAlCarrito = (producto) => {
  setCarrito((prev) => {
    const existente = prev.find((p) => p.id === producto.id); // Compara por ID, no por nombre
    if (existente) {
      return prev.map((p) =>
        p.id === producto.id
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      );
    }
    return [...prev, { ...producto, cantidad: 1 }]; // No necesitas redefinir el precio
  });
};


  // Aumentar cantidad
  const aumentarCantidad = (index) => {
    const nuevoCarrito = [...carrito]
    nuevoCarrito[index].cantidad += 1
    setCarrito(nuevoCarrito)
  }

  // Disminuir cantidad
  const disminuirCantidad = (index) => {
    const nuevoCarrito = [...carrito]
    if (nuevoCarrito[index].cantidad > 1) {
      nuevoCarrito[index].cantidad -= 1
      setCarrito(nuevoCarrito)
    }
  }

  // Remover producto
  const removerProducto = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index)
    setCarrito(nuevoCarrito)
  }

  return (
    <>
      <Catalogo
        onAbrir={() => setOpen(true)}
        agregarAlCarrito={agregarProductoAlCarrito}
        carrito={carrito}
      />
      <Carrito
        open={open}
        onOpenChange={setOpen}
        carrito={carrito}
        onIncrease={aumentarCantidad}
        onDecrease={disminuirCantidad}
        onRemove={removerProducto}
      />
    </>
  )
}
