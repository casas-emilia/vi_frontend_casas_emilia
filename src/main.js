import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { useRouter } from 'vue-router'
import createPersistedState from 'pinia-plugin-persistedstate'
import axios from 'axios'
import { setupAxiosInterceptors } from './utils/auth'
import Vue3TouchEvents from 'vue3-touch-events'

// Importaciones de estilos
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Importación de Bootstrap JS (incluye Popper.js)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(({ store }) => {
    store.router = markRaw(useRouter())
})
pinia.use(createPersistedState)

// Configuración global de axios
// axios.defaults.baseURL = 'http://localhost:8080/'
axios.defaults.baseURL = 'https://v1backendcasasamilia-production.up.railway.app/'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

// Configurar interceptores de Axios y token
setupAxiosInterceptors()

// Recupera el token JWT del localStorage
const token = localStorage.getItem('token')

// Si el token existe, se agrega al encabezado Authorization de todas las solicitudes
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Vue3TouchEvents, {
    disableClick: false, // Habilita clics además de gestos
});

app.mount('#app')