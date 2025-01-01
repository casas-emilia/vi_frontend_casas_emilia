<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow animate__animated animate__fadeIn">
          <div class="card-body">
            <h2 class="text-center mb-4">
              <i class="fas fa-lock"></i> Login
            </h2>
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                  placeholder="Ingresa tu correo"
                >
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Ingresa tu contraseña"
                >
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                <i class="fas fa-sign-in-alt me-2"></i>
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </form>
            <div v-if="error" class="alert alert-danger mt-3 animate__animated animate__shakeX">
              {{ error }}
            </div>
            <div class="mt-3 text-center">
              <router-link to="/recuperar-contrasena" class="text-primary">
                ¿Olvidaste tu contraseña?
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { setAuthToken, setUserInfo, decodeToken } from '@/utils/auth'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const response = await login(email.value, password.value)
    const { token } = response

    // Decode the token to get user information
    const decodedToken = decodeToken(token)
    const userId = decodedToken.usuario_id
    const roles = decodedToken.roles

    setAuthToken(token)
    setUserInfo(userId, roles)

/*     console.log('Login successful. Token:', token)
    console.log('User ID:', userId)
    console.log('Roles:', roles) */

    if (roles.includes('super_administrador')) {
      router.push('/administracionPrefabricadasManager')
    } else {
      // Show alert for unauthorized access
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permiso para acceder a esta área.',
        showConfirmButton: false,
        timer: 3000 // 2 seconds before redirect
      }).then(() => {
        // Redirect to home page after alert
        router.push('/')
      })
    }

  } catch (err) {
    console.error('Login error:', err)
    if (err.response) {
      error.value = err.response.data.error || 'An error occurred during login'
    } else if (err.request) {
      error.value = 'No response received from the server. Please try again.'
    } else {
      error.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* @import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
@import 'animate.css/animate.min.css'; */

.card {
  border-radius: 1rem;
  overflow: hidden;
}

.card-body {
  padding: 2rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
