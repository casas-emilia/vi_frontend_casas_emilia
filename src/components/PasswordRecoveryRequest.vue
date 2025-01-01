<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow animate__animated animate__fadeIn">
            <div class="card-body">
              <h2 class="text-center mb-4">
                <i class="fas fa-key"></i> Recuperar Contraseña
              </h2>
              <form @submit.prevent="handleRecoveryRequest">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    required
                  >
                </div>
                <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                  <i class="fas fa-paper-plane me-2"></i>
                  {{ isLoading ? 'Enviando...' : 'Enviar Solicitud' }}
                </button>
              </form>
              <div v-if="message" class="alert alert-success mt-3 animate__animated animate__fadeIn">
                {{ message }}
              </div>
              <div v-if="error" class="alert alert-danger mt-3 animate__animated animate__shakeX">
                {{ error }}
              </div>
              <div class="mt-3 text-center">
                <router-link to="/login" class="text-primary">
                  Volver al Login
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
  import axios from 'axios'
  
  const email = ref('')
  const message = ref('')
  const error = ref('')
  const isLoading = ref(false)
  
  const handleRecoveryRequest = async () => {
    message.value = ''
    error.value = ''
    isLoading.value = true
  
    try {
      // const response = await axios.post('http://localhost:8080/password-recovery', {
      const response = await axios.post('https://v1backendcasasamilia-production.up.railway.app/password-recovery', {
        email: email.value
      })
  
      message.value = response.data.message || 'Se ha enviado un email con las instrucciones para recuperar tu contraseña.'
      email.value = ''
    } catch (err) {
      if (err.response) {
        error.value = err.response.data.error || 'Ocurrió un error al procesar tu solicitud'
      } else {
        error.value = 'Error de red. Por favor, intenta nuevamente.'
      }
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  @import 'animate.css/animate.min.css';
  
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