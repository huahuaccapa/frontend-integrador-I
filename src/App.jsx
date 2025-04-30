// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/routes/dashboardlayout';
import { TableDemo } from './pages/panels/Administrador/Cliente/Components/TablesDemo';
import Login from "./pages/general/login/components/Login";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/general/login" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="Clientes" element={<TableDemo />} />
          {/* Agrega más rutas aquí si quieres */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
