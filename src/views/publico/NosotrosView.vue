<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Variables reactivas
const nombre_empresa = ref('');
const descripcion_empresa = ref('');
const historia_empresa = ref('');
const mision_empresa = ref('');
const vision_empresa = ref('');
const servicios_empresa = ref([]);

// Función para obtener datos de contacto desde el backend
const fetcNosotrosData = async () => {
    try {
        // const response = await axios.get(`http://localhost:8080/empresas/1`);
        const response = await axios.get(`https://v1backendcasasamilia-production.up.railway.app/empresas/1`);
        const empresa = response.data.empresa;

        nombre_empresa.value = empresa.nombre_empresa;
        descripcion_empresa.value = empresa.descripcion_empresa;
        historia_empresa.value = empresa.historia_empresa;
        mision_empresa.value = empresa.mision_empresa;
        vision_empresa.value = empresa.vision_empresa;
        servicios_empresa.value = empresa.servicios;
    } catch (error) {
        console.error('Error al obtener los datos de Empresa:', error);
    }
};

// Ejecutar al montar el componente
onMounted(fetcNosotrosData);
</script>

<template>
  <div class="about-us">
    <header class="header-bg text-white py-5 animate__animated animate__fadeIn">
      <div class="container position-relative z-1">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-3">{{ nombre_empresa }}</h1>
            <p class="lead fs-4 mb-4">{{ descripcion_empresa }}</p>
          </div>
          <div class="col-lg-4 d-none d-lg-block">
            <div class="image-container">
              <img src="/img/nosotros_1.png?height=300&width=300" alt="Wooden house illustration" class="img-fluid shadow-lg">
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="container my-5">
      <div class="row g-4">
        <div class="col-md-6 animate__animated animate__fadeInLeft">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h2 class="card-title text-primary mb-3">
                <i class="fas fa-history me-2"></i>Nuestra Historia
              </h2>
              <p class="card-text">{{ historia_empresa }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 animate__animated animate__fadeInRight">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h2 class="card-title text-success mb-3">
                <i class="fas fa-bullseye me-2"></i>Nuestra Misión
              </h2>
              <p class="card-text">{{ mision_empresa }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Nuestros Servicios - Sección Mejorada -->
    <section class="services-section py-5 animate__animated animate__fadeIn">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-4 fw-bold text-primary">Nuestros Servicios</h2>
          <div class="title-underline"></div>
        </div>
        
        <div class="row g-4 justify-content-center">
          <div v-for="(servicio, index) in servicios_empresa" 
               :key="servicio.id" 
               class="col-md-4"
               :class="{'animate__animated': true, 
                       'animate__fadeInUp': true}"
               :style="{'animation-delay': `${index * 0.2}s`}">
            <div class="service-card">
              <div class="service-icon">
                <i class="fa-solid fa-check"></i>
              </div>
              <h3 class="service-title">{{ servicio.nombre_servicio }}</h3>
              <p class="service-description">{{ servicio.descripcion_servicio }}</p>
              <!-- <div class="service-hover-content">
                <a href="#" class="btn btn-outline-light">Más información</a>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Portada -->
    <section>
      <div class="position-relative overflow-hidden">
        <img src="/img/nosotros_2.png" class="img-fluid w-100" alt="Imagen de portada"
          style="max-height: 60vh; object-fit: cover; filter: brightness(0.7);">
        <div class="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 class="display-3 fw-bold mb-4" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
            Diseñamos espacios, construimos sueños
          </h1>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

.animate__animated {
  animation-duration: 1s;
}

.header-bg {
  background-color: #1a5f7a;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  position: relative;
  overflow: hidden;
}

.header-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(26, 95, 122, 0.8) 0%, rgba(26, 95, 122, 0.9) 100%);
  z-index: 0;
}

.header-bg .container {
  position: relative;
  z-index: 1;
}

.image-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: auto;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6), rgba(26, 95, 122, 0.1));
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.image-container img:hover {
  transform: scale(1.1);
}

/* Nuevos estilos para la sección de servicios */
.services-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: #1a5f7a;
  margin: 1rem auto;
  border-radius: 2px;
}

.service-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.service-icon {
  width: 70px;
  height: 70px;
  background: #1a5f7a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transition: all 0.3s ease;
}

.service-icon i {
  font-size: 2rem;
  color: white;
}

.service-card:hover .service-icon {
  background: #2980b9;
  transform: scale(1.1);
}

.service-title {
  font-size: 1.5rem;
  color: #1a5f7a;
  margin-bottom: 1rem;
  font-weight: 600;
}

.service-description {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.service-hover-content {
  opacity: 0;
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  text-align: center;
  transition: all 0.3s ease;
  padding: 1rem;
  background: linear-gradient(to top, rgba(26, 95, 122, 0.9), transparent);
}

.service-card:hover .service-hover-content {
  opacity: 1;
  bottom: 0;
}

.btn-outline-light {
  border-width: 2px;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: white;
  color: #1a5f7a;
  transform: translateY(-2px);
}
</style>