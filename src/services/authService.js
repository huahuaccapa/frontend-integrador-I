//src\services\authService.js
export async function login(username, password) {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.text(); // backend devuelve texto plano
    return data;
  }
  