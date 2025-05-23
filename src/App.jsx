import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/routes/dashboardlayout';
import { Clientes } from './pages/panels/Administrador/Cliente/Clientes'; //Ruta de Clientes
import {Inventario} from './pages/panels/Administrador/Inventario/inventario';//Ruta de Inventario
import Login from './pages/general/login/Login'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal muestra el Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas dentro del dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="clientes" element={<Clientes />} />
          {/* Agrega más rutas aquí si deseas */}
          <Route path="inventario" element={<Inventario/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;