<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/administracionPrefabricadasManager">
        <i class="fas fa-tools me-2"></i>Administración
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="route in adminRoutes" :key="route.name">
            <router-link :to="{ name: route.name }" class="nav-link" active-class="active">
              <i :class="route.icon" class="me-1"></i>{{ route.title }}
            </router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <img :src="userProfileImage" alt="Profile" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
              {{ userName }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end animate__animated animate__fadeIn" aria-labelledby="dropdownMenuButton">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'administracionDatosUsuario' }">
                  <i class="fas fa-user-edit me-2"></i> Actualizar datos
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">
                  <i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getUserInfo, removeAuthToken, logout as authLogout } from '@/utils/auth';

const router = useRouter();
const userName = ref('');
const userProfileImage = ref('');

const adminRoutes = [
  { name: 'administracionTipos', title: 'Tipos', icon: 'fas fa-list' },
  { name: 'administracionCategorias', title: 'Categorías', icon: 'fas fa-tags' },
  { name: 'administracionEstilos', title: 'Estilos', icon: 'fas fa-paint-brush' },
  { name: 'administracionEmpresa', title: 'Empresa', icon: 'fas fa-building' },
  { name: 'administracionPrefabricadasManager', title: 'Prefabricadas', icon: 'fas fa-home' },
  { name: 'administracionPortadas', title: 'Portadas', icon: 'fas fa-images' },
  { name: 'administracionServicios', title: 'Servicios', icon: 'fas fa-concierge-bell' },
  { name: 'administracionRedes', title: 'Redes', icon: 'fas fa-network-wired' },
  { name: 'administracionUsuarios', title: 'Usuarios', icon: 'fas fa-users' },
  { name: 'administracionRoles', title: 'Roles', icon: 'fas fa-user-tag' },
  { name: 'administracionRolesUsuarios', title: 'Roles de Usuarios', icon: 'fas fa-user-cog' },
  { name: 'administracionNoticias', title: 'Portafolio', icon: 'fas fa-newspaper' },
];

onMounted(async () => {
  const userInfo = getUserInfo();
  if (userInfo) {
    try {
      // const response = await axios.get(`http://localhost:8080/administracion/empresas/1/usuarios/${userInfo.userId}`);
      const response = await axios.get(`https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/usuarios/${userInfo.userId}`);
      userName.value = `${response.data.usuario.primer_nombre} ${response.data.usuario.primer_apellido}`;
      userProfileImage.value = response.data.usuario.image || '/path/to/default/image.jpg';
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
});

const logout = () => {
  // Llamar a la función authLogout para limpiar el almacenamiento local
  authLogout();

  // Eliminar el token de autorización de las cabeceras de Axios
  delete axios.defaults.headers.common['Authorization'];

  // Redirigir al usuario a la página de inicio de sesión
  router.push('/login');

  // Mostrar un mensaje de éxito
  Swal.fire({
    icon: 'success',
    title: 'Sesión cerrada',
    text: 'Has cerrado sesión exitosamente',
    showConfirmButton: false,
    timer: 1500
  });
};
</script>

<style scoped>
/* @import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
@import 'animate.css/animate.min.css'; */

.navbar {
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-weight: bold;
}

.nav-link {
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.dropdown-menu {
  min-width: 200px;
  padding: 0.5rem 0;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-toggle::after {
  display: none;
}

.btn-light {
  color: #007bff;
  background-color: white;
  border-color: white;
}

.btn-light:hover {
  color: #0056b3;
  background-color: #f8f9fa;
}
</style>