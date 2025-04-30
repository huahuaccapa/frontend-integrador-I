import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de validación con Zod
const loginSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Columna de la imagen */}
      <div className="p-30 w-1/2 hidden md:block ">
        <img
          src="https://www.muvit.es/img/cms/1%20-%20Blog/Conjunto%20de%20accesorios%20blancos.jpeg" // Reemplaza con la URL de tu imagen
          alt="Imagen de login"
          className="object-cover w-full h-full rounded-lg"
        />
      </div>

      {/* Columna del formulario */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-sm p-6 bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Iniciar sesión</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-group">
              <label htmlFor="username" className="block text-sm font-semibold text-white">Usuario</label>
              <input
                id="username"
                type="text"
                {...register('username')}
                className="input w-full p-3 mt-2 text-white border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-semibold text-white">Contraseña</label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="input w-full p-3 text-white mt-2 border border-white-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full p-3 mt-4 bg-blue-500 text-white text-xl font-bold rounded-3xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
