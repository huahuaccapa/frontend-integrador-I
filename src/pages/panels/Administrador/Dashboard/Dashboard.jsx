"use client";

import React, { useEffect, useState } from "react";
import {
  ChartNoAxesCombined,
  AlertTriangle,
  Settings,
  LucideArrowUpRight
} from "lucide-react";
import {
  Bar,
  BarChart,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ServiceReporte from "@/api/ServiceReporte";
import ServiceVentas from "@/api/ServiceVentas";
import ServiceClientes from "@/api/ServiceClientes";
import ServicePedido from "@/api/ServicePedido";
import Services from "@/api/Services";
const inventoryData = [
  { month: "Jan", inventory: 8000 },
  { month: "Feb", inventory: 19000 },
  { month: "Mar", inventory: 15000 },
  { month: "Apr", inventory: 28000 },
  { month: "May", inventory: 40000 },
  { month: "Jun", inventory: 30000 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
};

export function DashboardAdm() {

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [topProductsData, setTopProductsData] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [productosBajoStock, setProductosBajoStock] = useState(0);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [inventarioMensual, setInventarioMensual] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchTopProducts = async () => {
    try {
      const response = await ServiceReporte.getTopProductosVendidos();
      // Transformar los datos de formato [["nombre", cantidad]] a {product, quantity}
      const formattedData = response.data.map(item => ({
        product: item[0], // Primer elemento es el nombre
        quantity: item[1]  // Segundo elemento es la cantidad
      }));
      setTopProductsData(formattedData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching top products:", err);
      // Datos de ejemplo en caso de error
      setTopProductsData([
        { product: "Audifonos", quantity: 8 },
        { product: "ddas", quantity: 5 },
        { product: "Producto 3", quantity: 4 },
        { product: "Producto 4", quantity: 3 },
        { product: "Producto 5", quantity: 2 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalVentas = async () => {
      try {
        const response = await ServiceVentas.getTotalVentas();
        setTotalVentas(response.data); 
      } catch (err) {
        console.error("Error al obtener total de ventas:", err);
        setTotalVentas(0);
      }
    };

    const fetchTotalClientes = async () => {
    try {
      const response = await ServiceClientes.contarClientes();
      setTotalClientes(response.data); 
    } catch (err) {
      console.error("Error al obtener total de clientes:", err);
      setTotalClientes(0);
    }
    };

    const fetchTotalExpenses = async () => {
  try {
    const response = await ServicePedido.getValorTotalPedidos();
    setTotalExpenses(response.data); 
  } catch (err) {
    console.error("Error al obtener total de gastos (pedidos):", err);
    setTotalExpenses(0);
  }
  };

   const fetchIngresosTotales = async () => {
    try {
      const response = await ServiceVentas.getIngresosTotales();
      setIngresosTotales(response.data);
    } catch (err) {
      console.error("Error al obtener ingresos totales:", err);
      setIngresosTotales(0);
    }
  };

  const fetchTotalStock = async () => {
    try {
      const response = await Services.getTotalStock();
      setTotalStock(response.data);
    } catch (err) {
      console.error("Error al obtener total stock:", err);
      setTotalStock(0);
    }
  };

  const fetchProductosBajoStock = async () =>{
    try{
      const response = await Services.contarProductosConStockBajo();
      setProductosBajoStock(response.data);
    }catch(err){
      console.error("Error al obtener la cantidad de productos con stock: ",err)
      setProductosBajoStock(0);
    }
  };

  const fetchVentasHoy = async () => {
  try {
    const response = await ServiceVentas.getVentasHoy();
    setVentasHoy(response.data);
  } catch (err) {
    console.error("Error al obtener ventas del día:", err);
    setVentasHoy(0);
  }
  };

  const fetchInventarioMensual = async () => {
    try {
      const response = await Services.obtenerInventarioMensual();
      setInventarioMensual(response.data);
    } catch (error) {
      console.error("Error al obtener inventario mensual", error);
    }
  };


    fetchTotalExpenses();
    fetchTotalClientes();
    fetchTopProducts();
    fetchTotalVentas();
    fetchIngresosTotales();
    fetchTotalStock();
    fetchProductosBajoStock();
    fetchVentasHoy();
    fetchInventarioMensual();

}, []);

  if (loading) {
    return <div className="p-6 text-black">Cargando datos...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-black">
        Error: {error}. Mostrando datos de ejemplo.
      </div>
    );
  }

  return (
    <div className="p-2 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Home - Punto de Venta AREQUIPA
      </h1>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<ChartNoAxesCombined className="w-6 h-6" />}
          title={`${totalStock} Items`}
          subtitle={"Productos totales en Stock"}
        />

        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          title={`${productosBajoStock} Bajo Stock`}
          subtitle="Alertas Críticas"
        />

        <StatCard
          icon={<Settings className="w-6 h-6" />}
          title={`${ventasHoy} Ventas en el dia`}
          subtitle="Ventas"
        />
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          color="text-yellow-400"
          title="Total Renovación"
          value={new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(ingresosTotales)}
          icon={<ChartNoAxesCombined className="w-6 h-6" />}
        />

        <MetricCard
          color="text-blue-400"
          title="Total Ventas"
          value={new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(totalExpenses)}
        />

        <MetricCard
          color="text-orange-400"
          title="Clientes Totales"
          value={totalClientes.toLocaleString()}
        />

        <MetricCard
          color="text-green-400"
          title="Pedidos Totales"
          value={totalVentas}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart - Top 5 productos */}
       <div className="bg-[#27272a] p-4 rounded-lg">
  <h2 className="text-lg font-semibold mb-4">Top 5 productos más vendidos</h2>
  <div className="h-[300px]">
    {topProductsData.length > 0 ? (
      <BarChart
        width={500}
        height={300}
        data={topProductsData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} stroke="#3f3f46" />
        <XAxis
          dataKey="product"
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#3f3f46', 
            borderColor: '#52525b',
            color: '#ffffff'
          }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Bar
          dataKey="quantity"
          fill="#84cc16"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        />
      </BarChart>
    ) : (
      <p className="text-gray-400">No hay datos disponibles</p>
    )}
  </div>
</div>
        {/* Line Chart */}
        <div className="bg-[#27272a] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Niveles de Inventario Mensuales
          </h2>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={inventarioMensual}>
              <CartesianGrid stroke="#3f3f46" />
              <XAxis
                dataKey="mes"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke="#facc15"
                strokeWidth={2}
                dot={{ r: 4, fill: "#facc15" }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

// COMPONENTS (se mantienen igual)
function StatCard({ icon, title, subtitle }) {
  return (
    <div className="flex items-center justify-between bg-[#27272a] p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-[#3f3f46] rounded-md">{icon}</div>
        <div>
          <p className="text-xl font-bold">{title}</p>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
      </div>
      <LucideArrowUpRight className="text-gray-400 w-4 h-4" />
    </div>
  );
}

function MetricCard({ title, value, color , icon}) {
  return (
    <div className="bg-[#27272a] p-4 rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <p className={`text-sm ${color}`}>{title}</p>
      </div>
        <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
    
  );
}