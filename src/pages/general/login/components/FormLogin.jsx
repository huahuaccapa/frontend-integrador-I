import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./../../../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./../../../../components/ui/form";
import { Input } from './../../../../components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  document_number: z.string().min(4, { message: 'Documento debe tener al menos 4 caracteres.' }),
  password: z.string().min(6, { message: 'Contraseña debe tener al menos 6 caracteres.' }),
});

export function FormLogin({ credentials, setCredentials, loginUser }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_number: credentials.document_number,
      password: credentials.password,
    },
  });

  const onSubmit = async (data) => {
    setCredentials(data);
    await loginUser({
      username: data.document_number,
      password: data.password,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa con tus credenciales</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="document_number"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="user" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">Ingresar</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
