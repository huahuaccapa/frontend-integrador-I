import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000
});

// Interceptor de solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Enviando ${config.method?.toUpperCase()} a ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Error en interceptor de solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida:', {
      status: response.status,
      from: response.config.url
    });
    return response;
  },
  (error) => {
    const errorInfo = {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    };
    console.error('Error en respuesta:', errorInfo);

    if (error.code === 'ECONNABORTED') {
      error.message = 'El servidor no respondió a tiempo';
    } else if (!error.response) {
      error.message = `No se pudo conectar al servidor (${error.config?.url})`;
    }

    return Promise.reject(error);
  }
);

export default api;