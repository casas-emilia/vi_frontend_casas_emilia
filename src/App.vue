<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Footer from '@/components/Footer.vue';
import Nav from './components/Nav.vue';
import NavAdminiComponent from './components/Administracion/NavAdminiComponent.vue';
import { isAuthenticated, isSuperAdmin } from './auth';

const route = useRoute();
const router = useRouter();

const adminRouteNames = [
  'administracion', 'administracionTipos', 'administracionCategorias', 'administracionEstilos', 
  'administracionEmpresa', 'administracionPrefabricadasManager', 'administracionPortadas', 
  'administracionServicios','administracionRedes', 'administracionUsuarios', 'administracionRoles', 
  'administracionRolesUsuarios', 'administracionNoticias', 'administracionDatosUsuario'
];

const isAdminRoute = ref(false);
const isRouteLoaded = ref(false);
const isAuthorized = ref(true);

const updateNav = async () => {
  isAdminRoute.value = adminRouteNames.includes(route.name);
  
  if (isAdminRoute.value) {
    if (!isAuthenticated()) {
      isAuthorized.value = false;
      router.push('/login');
    } else if (!isSuperAdmin()) {
      isAuthorized.value = false;
      // Redirigir a una página de acceso denegado o a la página principal
      router.push('/');
    } else {
      isAuthorized.value = true;
    }
  } else {
    isAuthorized.value = true;
  }

  setTimeout(() => {
    isRouteLoaded.value = true;
  }, 500);
};

onMounted(() => {
  updateNav();
});

watch(() => route.name, () => {
  isRouteLoaded.value = false;
  updateNav();
});
</script>

<template>
  <div>
    <div v-if="!isRouteLoaded" class="loader-container">
      <div class="spinner"></div>
    </div>

    <div v-else-if="!isAuthorized" class="unauthorized-message">
      <h2>Acceso no autorizado</h2>
      <p>No tienes permiso para acceder a esta página.</p>
    </div>

    <div v-else>
      <component :is="isAdminRoute ? NavAdminiComponent : Nav" />
      <RouterView />
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.unauthorized-message {
  text-align: center;
  padding: 2rem;
}
</style>
