import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  username: z.string().min(3, 'Usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState('');

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
      
      const response = await axios.post('http://localhost:8080/api/auth/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.role) {
        // Guardar datos de autenticación
        localStorage.setItem('auth', JSON.stringify({
          username: response.data.username,
          role: response.data.role,
          email: response.data.email
        }));
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('username', response.data.username);

        // Redirigir según el rol
        const redirectPath = response.data.role === 'ADMIN' 
          ? '/dashboard' 
          : '/dashboard/ventas';
        
        navigate(redirectPath);
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

  return (
    <div className="flex min-h-screen bg-black">
      <div className="p-30 w-1/2 hidden md:block">
        <img
          src="https://www.muvit.es/img/cms/1%20-%20Blog/Conjunto%20de%20accesorios%20blancos.jpeg" 
          alt="Imagen de login"
          className="object-cover w-full h-full rounded-lg"
        />
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-sm p-6 bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Iniciar sesión</h2>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-group">
              <label htmlFor="username" className="block text-sm font-semibold text-white">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                {...register('username')}
                className="input w-full p-3 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-semibold text-white">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="input w-full p-3 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full p-3 mt-4 bg-blue-500 text-white text-xl font-bold rounded-3xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <Link to="/recuperar-contrasena" className="text-sm text-blue-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
