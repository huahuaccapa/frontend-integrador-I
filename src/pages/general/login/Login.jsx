import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  username: z.string().min(3, 'Usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState('');
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [tempAuth, setTempAuth] = React.useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoginError('');
      
      const response = await axios.post('https://multiservicios-85dff762daa1.herokuapp.com/api/auth/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        // Guardar datos temporalmente
        setTempAuth({
          username: response.data.username,
          role: response.data.role,
          email: response.data.email
        });

        // Verificar si requiere cambio de contraseña
        if (response.data.passwordChangeRequired || response.data.firstLogin) {
          setShowPasswordModal(true);
          return;
        }

        // Si no requiere cambio, proceder al login
        completeLogin(response.data);
      }
    } catch (error) {
      console.error('Error de login:', error);
      setLoginError(
        error.response?.data?.message || 
        error.message || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    }
  };

  const completeLogin = (userData) => {
    // Guardar datos de autenticación
    localStorage.setItem('auth', JSON.stringify({
      username: userData.username,
      role: userData.role,
      email: userData.email
    }));
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('username', userData.username);

    // Redirigir según el rol
    const redirectPath = userData.role === 'ADMIN' 
      ? '/dashboard' 
      : '/dashboard/ventas';
    
    navigate(redirectPath);
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      // Cambiar contraseña en el backend
      await axios.put(`https://multiservicios-85dff762daa1.herokuapp.com/api/auth/change-password?username=${tempAuth.username}`, {
        password: newPassword
      });

      // Cerrar modal y completar login
      setShowPasswordModal(false);
      completeLogin(tempAuth);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setLoginError(
        error.response?.data?.message || 
        error.message || 
        'Error al cambiar la contraseña. Intenta nuevamente.'
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Modal para cambio de contraseña obligatorio */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg mx-4">
            <h2 className="text-2xl font-bold text-center text-white mb-4">
              Cambio de contraseña requerido
            </h2>
            
            <p className="text-gray-300 mb-6 text-center">
              Por seguridad del sistema, debes establecer una nueva contraseña para continuar.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newPassword = formData.get('newPassword');
              const confirmPassword = formData.get('confirmPassword');
              
              if (newPassword !== confirmPassword) {
                setLoginError('Las contraseñas no coinciden');
                return;
              }
              
              if (newPassword.length < 6) {
                setLoginError('La contraseña debe tener al menos 6 caracteres');
                return;
              }
              
              handlePasswordChange(newPassword);
            }}>
              
              {loginError && (
                <div className="mb-4 p-3 bg-red-900 text-red-100 rounded text-sm">
                  {loginError}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Nueva contraseña
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar nueva contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-200"
              >
                Establecer nueva contraseña
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sección de imagen */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="https://www.muvit.es/img/cms/1%20-%20Blog/Conjunto%20de%20accesorios%20blancos.jpeg"
          alt="Imagen de login"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Formulario principal de login */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4">
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Iniciar Sesión
          </h2>
          
          {loginError && !showPasswordModal && (
            <div className="mb-6 p-3 bg-red-900 text-red-100 rounded text-sm">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                {...register('username')}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-200"
            >
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
