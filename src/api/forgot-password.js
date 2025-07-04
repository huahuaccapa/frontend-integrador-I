// src/api/forgot-password.js
import axios from 'axios';

const API_URL = 'https://multiservicios-85dff762daa1.herokuapp.com/api/auth';

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (username, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password`, { 
    username, 
    newPassword 
  });
  return response.data;
};