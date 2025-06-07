import { Home, Proportions, User, Store, ShoppingBag, Handshake } from 'lucide-react';
import React from 'react';
import { NavLink } from "react-router-dom";

export default function AppSidebar() {
  return (
    <div className="h-screen w-50 bg-[#0f172a] text-white flex flex-col justify-between p-4">
      {/* Logo o encabezado */}
      <div>
        <div className="text-indigo-400 font-bold text-xl text-white mb-6">
          Multiservis Nico
          <div className="flex shrink-0 items-center">
            <img
              alt="Your Company"
              src="https://images.vexels.com/media/users/3/142810/isolated/preview/ba0c22cef0e0d4a277d74333536482d9-escudo-emblema-logo.png"
              className="h-30 w-auto"
            />
          </div>
        </div>

        {/* Menú principal */}
        <nav className="space-y-4 alig-center">
          <SidebarItem icon={Home} title="Home" to="/dashboard" />
          <SidebarItem icon={User} title="Clientes" to="clientes" /> {/* Cambiado a ruta relativa */}
          <SidebarItem icon={Proportions} title="Reportes" />
          <SidebarItem icon={ShoppingBag} title="Inventario" to="inventario" />
          <SidebarItem icon={Handshake} title="Proveedores" to="proveedores"/>
          <SidebarItem icon={Store} title="Ventas" to="ventas" />
          
        </nav>
      </div>

      {/* Usuario */}
      <div className="flex items-center gap-3 mt-6">
        <img
          src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
          alt="Tom Cook"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-sm font-medium">Tom Cook</span>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, title, badge, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-800 ${
          isActive ? 'bg-indigo-700 font-semibold' : 'text-gray-300'
        }`
      }
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="text-sm">{title}</span>
      </div>
      {badge && (
        <span className="bg-indigo-500 text-xs rounded-full px-2 py-0.5 font-medium">{badge}</span>
      )}
    </NavLink>
  );
}