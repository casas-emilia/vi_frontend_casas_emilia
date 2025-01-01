import axios from 'axios'; // Importa axios directamente

/**
 * Realiza el login con las credenciales proporcionadas.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<Object>} - Los datos de usuario y token.
 */
export const login = async (email, password) => {
  try {
    // const response = await axios.post('/login', { email, password });
    const response = await axios.post('https://v1backendcasasamilia-production.up.railway.app/login', { email, password });
    return response.data; // Devuelve solo los datos relevantes
  } catch (error) {
    console.error('Error en login:', error);
    throw error.response?.data || { message: 'Error desconocido' }; // Retorna el error de la API o un mensaje genérico
  }
};
