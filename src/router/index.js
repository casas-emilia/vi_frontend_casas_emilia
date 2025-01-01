import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/publico/HomeView.vue')
  },
  {
    path: '/nosotros',
    name: 'nosotros',
    component: () => import('../views/publico/NosotrosView.vue')
  },
  {
    path: '/prefabricadas',
    name: 'prefabricadas',
    component: () => import('../views/publico/PrefabricadasView.vue')
  },
  {
    path: '/prefabricadas/:id',
    name: 'prefabricada-detalle',
    component: () => import('../views/publico/PrefabricadaDetalleView.vue')
  },
  {
    path: '/contactos',
    name: 'contactos',
    component: () => import('../views/publico/ContactoView.vue')
  },
  /* {
    path: '/categorias',
    name: 'categorias',
    component: () => import('../views/publico/CategoriasView.vue')
  }, */
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/publico/BlogView.vue')
  },
  {
    path: '/blog/:id',
    name: 'blog-detalle',
    component: () => import('../views/publico/BlogDetalleView.vue')
  },
  {
    path: '/:pathMatch(.*)*', // Captura cualquier ruta no encontrada
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  },

  // Login y gestion de contraseña
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/publico/LoginView.vue')
  },
  {
    path: '/recuperar-contrasena',
    name: 'PasswordRecoveryRequest',
    component: () => import('../components/PasswordRecoveryRequest.vue')
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('../components/ResetPassword.vue')
  },

  //Administración
  {
    path: '/administracion',
    name: 'administracion',
    component: () => import('../views/Administracion/PanelAdministracion.vue')
  },
  {
    path: '/administracionTipos',
    name: 'administracionTipos',
    component: () => import('../views/Administracion/AdministracionTiposView.vue')
  },
  {
    path: '/administracionCategorias',
    name: 'administracionCategorias',
    component: () => import('../views/Administracion/AdministracionCategoriasView.vue')
  },
  {
    path: '/administracionEstilos',
    name: 'administracionEstilos',
    component: () => import('../views/Administracion/AdministracionEstilosView.vue')
  },
  {
    path: '/administracionEmpresa',
    name: 'administracionEmpresa',
    component: () => import('../views/Administracion/AdministracionEmpresaView.vue')
  },
/*   {
    path: '/administracionPrefabricadas',
    name: 'administracionPrefabricadas',
    component: () => import('../views/Administracion/AdministracionPrefabricadasView.vue')
  }, */
  {
    path: '/administracionPrefabricadasManager',
    name: 'administracionPrefabricadasManager',
    component: () => import('../views/Administracion/PrefabricadasManager.vue'),
    meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: '/administracionPortadas',
    name: 'administracionPortadas',
    component: () => import('../views/Administracion/AdministracionPortadasView.vue')
  },
  {
    path: '/administracionServicios',
    name: 'administracionServicios',
    component: () => import('../views/Administracion/AdministracionServiciosView.vue')
  },
  {
    path: '/administracionRedes',
    name: 'administracionRedes',
    component: () => import('../views/Administracion/AdministracionRedesView.vue')
  },
  {
    path: '/administracionUsuarios',
    name: 'administracionUsuarios',
    component: () => import('../views/Administracion/AdministracionUsuariosView.vue')
  },
  {
    path: '/administracionRoles',
    name: 'administracionRoles',
    component: () => import('../views/Administracion/AdministracionRolesView.vue')
  },
  {
    path: '/administracionRolesUsuarios',
    name: 'administracionRolesUsuarios',
    component: () => import('../views/Administracion/AdministracionRolesUsuariosView.vue')
  },
  {
    path: '/administracionNoticias',
    name: 'administracionNoticias',
    component: () => import('../views/Administracion/AdministracionNoticiasView.vue')
  },
  {
    path: '/administracionDatosUsuario',
    name: 'administracionDatosUsuario',
    component: () => import('../views/Administracion/AdministracionDatosUsuarioView.vue')
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;  // Si tienes una posición guardada (por ejemplo, al volver atrás), usa esa posición
    } else {
      return { top: 0 };  // De lo contrario, siempre vuelve al inicio de la página
    }
  }
});

// Middleware de autenticación global
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    console.warn('Not authenticated. Redirecting to login...')
    next('/login')
  } else {
    next()
  }
})


export default router;
