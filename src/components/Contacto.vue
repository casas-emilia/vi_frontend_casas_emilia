<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Ubicacion from './Ubicacion.vue';

// Variables reactivas
const email = ref('');
const address = ref('');
const phone = ref('');
const showCopyMessage = ref(false);

// Función para abrir WhatsApp con un mensaje predeterminado
const openWhatsApp = () => {
    const message = encodeURIComponent('Hola, me gustaría obtener más información.');
    window.open(`https://wa.me/${phone.value}?text=${message}`, '_blank');
};

// Función para copiar el email al portapapeles
const copyEmail = () => {
    navigator.clipboard.writeText(email.value).then(() => {
        showCopyMessage.value = true;
        setTimeout(() => {
            showCopyMessage.value = false;
        }, 2000); // Mostrar mensaje durante 2 segundos
    });
};

// Función para obtener datos de contacto desde el backend
const fetchContactData = async () => {
    try {
        // const response = await axios.get(`http://localhost:8080/empresas/1`); // Reemplaza con tu URL
        const response = await axios.get(`https://v1backendcasasamilia-production.up.railway.app/empresas/1`);
        const empresa = response.data.empresa;
        email.value = empresa.email_empresa;
        address.value = empresa.ubicacion_empresa;
        phone.value = empresa.celular_empresa;
    } catch (error) {
        console.error('Error al obtener los datos de contacto:', error);
    }
};

// Ejecutar al montar el componente
onMounted(fetchContactData);
</script>

<template>
    <!-- Portada -->
    <section>
        <div class="position-relative overflow-hidden">
            <img src="/img/contacto.png" class="img-fluid w-100" alt="Imagen de portada"
                style="max-height: 60vh; object-fit: cover; filter: brightness(0.7);">
            <div class="position-absolute top-50 start-50 translate-middle text-center text-white">
                <h1 class="display-3 fw-bold mb-4" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Contáctanos
                </h1>
            </div>
        </div>
    </section>

    <section class="bg-pattern py-3">
        <!-- Información de contacto -->
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-lg animate__animated animate__fadeIn">
                        <div class="card-body">
                            <h2 class="section-title text-center mb-4">Nuestros medios</h2>
                            <div class="contact-info">
                                <div class="mb-3 animate__animated animate__fadeInLeft d-flex align-items-center">
                                    <i class="fas fa-envelope fa-fw text-primary"></i>
                                    <span>{{ email }}</span>
                                    <button @click="copyEmail" class="btn btn-sm btn-outline-primary ms-2">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                                <div class="mb-3 animate__animated animate__fadeInLeft animate__delay-1s">
                                    <i class="fas fa-map-marker-alt fa-fw text-primary"></i>
                                    <span>{{ address }}</span>
                                </div>
                                <div class="mb-3 animate__animated animate__fadeInLeft animate__delay-2s">
                                    <i class="fas fa-phone fa-fw text-primary"></i>
                                    <span>{{ phone }}</span>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <button @click="openWhatsApp"
                                    class="btn btn-success btn-lg animate__animated animate__pulse animate__infinite">
                                    <i class="fab fa-whatsapp me-2"></i>Enviar mensaje por WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <br>
        
            <!-- Mensaje de copiado -->
            <div v-if="showCopyMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div class="alert alert-success" role="alert">
                    E-mail copiado
                </div>
            </div>
        </div>
        
    </section>

</template>


<style scoped>
.bg-pattern {
  background-color: #f0f8ff;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239bc2e6' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.card {
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.contact-info div {
    font-size: 1.1rem;
    margin-bottom: 1rem;
}

.contact-info i {
    width: 30px;
    text-align: center;
    margin-right: 10px;
}

.btn-success {
    background-color: #25D366;
    border-color: #25D366;
}

.btn-success:hover {
    background-color: #128C7E;
    border-color: #128C7E;
}

.toast {
    font-size: 0.9rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0056b3;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

</style>