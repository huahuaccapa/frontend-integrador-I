// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/routes/dashboardlayout';
import { TableDemo } from './pages/panels/Administrador/Cliente/Components/TablesDemo';
<<<<<<< HEAD
import Login from './pages/general/login/Login'; // ✅ Ruta corregida
=======
import Login from "./pages/general/login/components/Login";
>>>>>>> ef84153af0e629cbaf692515d77ead4be5c64ef3

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        {/* Ruta principal muestra el Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas dentro del dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="clientes" element={<TableDemo />} />
          {/* Agrega más rutas aquí si deseas */}
=======
      <Route path="/general/login" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="Clientes" element={<TableDemo />} />
          {/* Agrega más rutas aquí si quieres */}
>>>>>>> ef84153af0e629cbaf692515d77ead4be5c64ef3
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
