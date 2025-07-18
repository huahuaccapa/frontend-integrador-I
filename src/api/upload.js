import axios from 'axios';

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('https://multiservicios-85dff762daa1.herokuapp.com/api/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url; // Ejemplo: http://localhost:8080/uploads/filename.jpg
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return null;
  }
};

export default uploadImage;