import React, { useState } from "react";
import { Button } from "@/components/custom/button";
import { Separator } from "@/components/ui/separator";
import { RVTable } from "./componentes/RVentas/DataReportes"; 
import { RCTable } from "./componentes/RCliente/DataClientes";
import { RITable } from "./componentes/RInventario/DataInventario";

export function Reportes() {
  const [reporteActivo, setReporteActivo] = useState("");

  const mostrarReporte = (tipo) => {
    setReporteActivo(tipo === reporteActivo ? "" : tipo); // alterna entre mostrar y ocultar
  };

  return (
    <div className="p-2">
      <h1 className="font-bold text-black text-2xl mb-4">REPORTES</h1>

      <Separator className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Button onClick={() => mostrarReporte("clientes")}>Reporte Clientes</Button>
        <Button onClick={() => mostrarReporte("inventario")}>Reporte Inventario</Button>
        <Button onClick={() => mostrarReporte("ventas")}>Reporte Ventas</Button>
      </div>

      <Separator className="mb-4" />

      {reporteActivo === "ventas" && (
        <div className="mt-6">
          <RVTable />
        </div>
      )}
      {reporteActivo === "clientes" && (
        <div className="mt-6">
          <RCTable />
        </div>
      )}
      {reporteActivo === "inventario" && (
        <div className="mt-6">
          <RITable />
        </div>
      )}
    </div>
  );
}
