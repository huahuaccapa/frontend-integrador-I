// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/routes/dashboardlayout';
import { TableDemo } from './pages/panels/Administrador/Cliente/Components/TablesDemo';
import Login from './pages/general/login/Login'; 
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal muestra el Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas dentro del dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="clientes" element={<TableDemo />} />
          {/* Agrega más rutas aquí si deseas */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
