import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreateUser() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password || !formData.email) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: 'EMPLEADO'
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setSuccess('Usuario creado exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data ||
        'Error al crear el usuario. Verifica los datos e intenta nuevamente.'
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear Nuevo Usuario</CardTitle>
          <CardDescription>
            Complete los campos para registrar un nuevo empleado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario *</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ejemplo: juan123"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                minLength="6"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol del Usuario</Label>
              <Input
                id="role"
                value="EMPLEADO"
                disabled
                className="cursor-not-allowed bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                Todos los nuevos usuarios son registrados como Empleados
              </p>
            </div>

            <CardFooter className="flex justify-end px-0 pb-0 pt-6">
              <Button type="submit" className="w-full">
                Crear Usuario
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}