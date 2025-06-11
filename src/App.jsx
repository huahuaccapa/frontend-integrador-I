import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/routes/DashboardLayout';
import Login from './pages/general/login/Login';
import { Clientes } from './pages/panels/Administrador/Cliente/Clientes';
import { Inventario } from './pages/panels/Administrador/Inventario/inventario';
import { Ventas } from './pages/panels/Administrador/Ventas/ventas';
import CreateUser from './pages/general/login/components/CreateUser';
import ForgotPassword from './pages/general/login/components/ForgotPassword';
import Profile from './pages/general/login/components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
        <Route path="/admin/crear-usuario" element={<CreateUser />} />
        <Route path="/perfil" element={<Profile />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="clientes" element={<Clientes />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="ventas" element={<Ventas />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;