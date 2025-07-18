//src\services\authService.js
export async function login(username, password) {
    const response = await fetch('hhttps://multiservicios-85dff762daa1.herokuapp.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.text(); // backend devuelve texto plano
    return data;
  }
  