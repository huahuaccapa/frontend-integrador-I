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
import { Reportes } from './pages/panels/Administrador/Reportes/Reportes';
import CreateUser from './pages/general/login/components/CreateUser';
import ForgotPassword from './pages/general/login/components/ForgotPassword';
import Profile from './pages/general/login/components/Profile';
import { HistorialCliente } from './pages/panels/Administrador/Reportes/componentes/RCliente/Historial';
import { ReporteStock } from './pages/panels/Administrador/Reportes/componentes/RInventario/ReporteStock';


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
            <Route path="inventario" element={<Inventario />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="reportes" element={<Reportes/>}/>
            <Route path="inventario/crearproducto" element={<Producto />} />
            <Route path="ventas/detalle" element={<ProcesoVenta />} />
            <Route path="proveedores/pedidos" element={<Pedido />} />
            <Route path="proveedores/pedidos/nuevo" element={<NuevoPedido />} />
            <Route path="reportes/historialcliente" element={<HistorialCliente/>}/>
            <Route path="reportes/reporteStock" element={<ReporteStock/>}/>
          </Route>

          {/* Rutas de nivel superior */}
          <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
          <Route path="/admin/crear-usuario" element={<CreateUser />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}


export default App;