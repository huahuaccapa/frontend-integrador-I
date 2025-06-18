//src\routes\AdminRoutes.jsx
import React from 'react'
import GeneralError from '@/pages/general/errors/general-error'
import PrivateRoute from './../utils/PrivateRoutes'
import { Component } from 'lucide-react';

const adminRoutes = [
  {
    path: '/admin',
    element: <PrivateRoute role="COORDINATOR" />,
    children: [
      {
        path: '', // Define esto como vacío para utilizar la ruta base '/admin'
        lazy: async () => {
          const AppShell = await import('../components/app-shell');
          return { Component: AppShell.default };
        },
        errorElement: <GeneralError />,
        children: [
          { index: true, lazy: async () => ({ Component: (await import('../pages/panels/admin/dashboard/Dashboard')).default }) },
          { path: 'dashboard', lazy: async () => ({ Component: (await import('../pages/panels/admin/dashboard/Dashboard')).default }) },
          { path: 'programas', lazy: async () => ({ Component: (await import('../pages/panels/admin/programs/programs')).default }) },
         {
            path: 'ajustes',
            lazy: async () => ({ Component: (await import('../pages/general/settings')).default }),
            errorElement: <GeneralError />,
            children: [
              { index: true, lazy: async () => ({ Component: (await import('../pages/general/settings/profile')).default }) },
              { path: 'cuenta', lazy: async () => ({ Component: (await import('../pages/general/settings/account')).default }) },
              { path: 'apariencia', lazy: async () => ({ Component: (await import('../pages/general/settings/appearance')).default }) },
              { path: 'notificaciones', lazy: async () => ({ Component: (await import('../pages/general/settings/notifications')).default }) },
              { path: 'display', lazy: async () => ({ Component: (await import('../pages/general/settings/display')).default }) },
            ],
          },
        ],
      },
    ],
  },
];

export default adminRoutes;