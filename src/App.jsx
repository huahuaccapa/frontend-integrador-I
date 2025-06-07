import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/routes/dashboardlayout';
import { Clientes } from './pages/panels/Administrador/Cliente/Clientes'; //Ruta de Clientes
import {Inventario} from './pages/panels/Administrador/Inventario/inventario';//Ruta de Inventario
import Login from './pages/general/login/Login'; 
import {Proveedores} from './pages/panels/Administrador/Proveedor/proveedor';
import {Pedido} from './pages/panels/Administrador/Proveedor/componentes/FormPedidos';
import {NuevoPedido} from './pages/panels/Administrador/Proveedor/componentes/FormNuevoPedido';
import {Producto} from './pages/panels/Administrador/Inventario/componentes/NuevoProducto'
import {Ventas} from './pages/panels/Administrador/Ventas/ventas' 
import { ProcesoVenta } from './pages/panels/Administrador/Ventas/componentes/ProcesoVenta';
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className='bg-yellow-300'>
    <Router>
      <Routes>
        {/* Ruta principal muestra el Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas dentro del dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="clientes" element={<Clientes />} />
          {/* Agrega más rutas aquí si deseas */}
          <Route path="inventario" element={<Inventario/>}/>
          <Route path="ventas" element={<Ventas/>}/>
          <Route path="proveedores" element={<Proveedores/>} />

          
          <Route path="/dashboard/inventario/crearproducto" element={<Producto/>}/> 
          <Route path="/dashboard/ventas/detalle" element={<ProcesoVenta />} /> 
          <Route path="/dashboard/ventas" element={<Ventas/>}/>
           <Route path="/dashboard/proveedores/pedidos" element={<Pedido/>}/> 
          <Route path="/dashboard/proveedores/pedidos/nuevo" element={<NuevoPedido/>}/> 
        </Route>
      </Routes>
    </Router>
    <Toaster />
    </div>
  );
}

export default App;