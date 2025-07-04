//src\routes\dashboardlayout.jsx
import React from 'react';
import Navbar from '@/navbar/nabvar';
import AppSidebar from '@/components/app-sidebar';
import { SidebarProvider,SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';


export default function DashboardLayout({children}) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          {/* Sidebar */}
          <aside className="w-50 bg-gray-50 border-r">
            <AppSidebar />
          </aside>

          {/* Contenedor principal */}
          <div className="flex flex-col flex-1 w-full">
            {/* Navbar en la parte superior del contenido principal */}
            <Navbar />
            {/* <SidebarTrigger/>
            {children}*/}
            {/* Contenido principal */}
            <main className="flex-1 p-6 bg-white">
              <Outlet /> {/* Aquí se carga la ruta actual como Clientes */}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}