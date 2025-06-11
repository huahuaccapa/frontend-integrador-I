import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/forgot-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setMessage('Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Hubo un problema al procesar tu solicitud.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Recuperar Contraseña</h2>
        <p className="mb-4">Ingresa tu correo electrónico para recibir instrucciones.</p>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo Electrónico *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Enviar Instrucciones
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-blue-500 hover:underline"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}