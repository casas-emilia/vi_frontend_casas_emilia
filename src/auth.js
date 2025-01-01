// src/auth.js

import { jwtDecode } from 'jwt-decode';

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
}

export function isSuperAdmin() {
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');
  return roles.includes('super_administrador');
}