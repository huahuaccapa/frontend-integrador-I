import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Clientes', href: '/dashboard/clientes' },
  { name: 'Inventario', href: '/dashboard/inventario' },
  { name: 'Proveedores', href: '/dashboard/proveedores' },
  { name: 'Reportes', href: '/dashboard/reportes' },
  { name: 'Ventas', href: '/dashboard/ventas' },

];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !!userRole;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Botón móvil */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block size-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block size-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo y navegación */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREayWE3odb7eT-UL3xhc96tM-7kob4BYrxvA&s" 
                    alt="Company Logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          window.location.pathname === item.href
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panel derecho (usuario logueado o botones de inicio de sesión) */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isLoggedIn ? (
                  <>
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                      aria-label="Notifications"
                    >
                      <BellIcon className="size-6" aria-hidden="true" />
                    </button>

                    {/* Menú usuario */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" aria-label="Open user menu">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="size-8 rounded-full"
                            src={
                              userRole === 'ADMIN'
                                ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
                                : 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' 
                            }
                            alt={userRole === 'ADMIN' ? "Admin user icon" : "Employee user icon"}
                          />
                        </MenuButton>
                      </div>
                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <MenuItem>
                          <div className="block px-4 py-2 text-sm text-gray-700 border-b select-none cursor-default">
                            {userRole === 'ADMIN' ? 'Administrador' : 'Empleado'}
                          </div>
                        </MenuItem>

                        {userRole === 'ADMIN' && (
                          <MenuItem>
                            <Link
                              to="/admin/crear-usuario"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Crear Usuario
                            </Link>
                          </MenuItem>
                        )}

                        {/* Opción de perfil disponible para ambos */}
                        <MenuItem>
                          <Link
                            to="/perfil"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Mi Perfil
                          </Link>
                        </MenuItem>

                        {/* Botón cerrar sesión */}
                        <MenuItem>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Cerrar Sesión
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </>
                ) : (
                  <div className="hidden sm:flex space-x-4">
                    <Link
                      to="/"
                      className={classNames(
                        window.location.pathname === '/'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                    >
                      Iniciar Sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menú móvil */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    window.location.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}

              {!isLoggedIn ? (
                <div className="border-t border-gray-700 pt-4">
                  <DisclosureButton
                    as={Link}
                    to="/"
                    className={classNames(
                      window.location.pathname === '/'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    Iniciar sesión
                  </DisclosureButton>
                </div>
              ) : (
                <div className="border-t border-gray-700 pt-4">
                  <DisclosureButton
                    as="div"
                    className="block px-3 py-2 text-base font-medium text-gray-400"
                  >
                    {userRole === 'ADMIN' ? 'Administrador' : 'Empleado'}
                  </DisclosureButton>

                  {userRole === 'ADMIN' && (
                    <DisclosureButton
                      as={Link}
                      to="/admin/crear-usuario"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Crear Usuario
                    </DisclosureButton>
                  )}

                  {/* Link Perfil para móvil */}
                  <DisclosureButton
                    as={Link}
                    to="/perfil"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Mi Perfil
                  </DisclosureButton>

                  <DisclosureButton
                    as="button"
                    onClick={handleLogout}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Cerrar Sesión
                  </DisclosureButton>
                </div>
              )}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}

