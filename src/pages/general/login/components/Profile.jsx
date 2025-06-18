import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('auth'));
        if (!authData || !authData.username) {
          navigate('/');
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/auth/profile/${authData.username}`
        );
        setProfile(response.data);
      } catch (err) {
        setError('Error al cargar el perfil. Por favor, intenta nuevamente.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
        <Button onClick={() => navigate('/')} className="mt-4">
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Mi Perfil</CardTitle>
          <CardDescription>
            Información básica de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <div className="p-2 border rounded-md bg-gray-50">
              {profile?.username || 'N/A'}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <div className="p-2 border rounded-md bg-gray-50">
              {profile?.email || 'N/A'}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <div className="p-2 border rounded-md bg-gray-50">
              {profile?.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
            <div className="p-2 border rounded-md bg-gray-50">
              {profile?.createdAt || 'N/A'}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Volver
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Ir al Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
