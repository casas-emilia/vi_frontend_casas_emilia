import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
}

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
}

export const setUserInfo = (userId, roles) => {
  localStorage.setItem('userId', userId);
  localStorage.setItem('roles', JSON.stringify(roles));
}

export const getUserInfo = () => {
  return {
    userId: localStorage.getItem('userId'),
    roles: JSON.parse(localStorage.getItem('roles') || '[]')
  }
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
}

export const isSuperAdmin = () => {
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');
  return roles.includes('super_administrador');
}

export const logout = () => {
  removeAuthToken();
  localStorage.removeItem('userId');
  localStorage.removeItem('roles');
}

export const decodeToken = (token) => {
  return jwtDecode(token);
}

export const setupAxiosInterceptors = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
        router.push('/login')
      }
      return Promise.reject(error);
    }
  );
}