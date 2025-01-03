<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import EjecutivosVentas from "@/components/EjecutivosVentas.vue";

const prefabricada = ref(null);
const loading = ref(true);
const error = ref(null);
const lightboxOpen = ref(false);
const currentImageIndex = ref(0);

const route = useRoute();
// const baseURL = "http://localhost:8080/empresas/1";
const baseURL = "https://v1backendcasasamilia-production.up.railway.app/empresas/1";

onMounted(async () => {
  const prefabricadaId = route.params.id;
  try {
    loading.value = true;
    const { data } = await axios.get(`${baseURL}/prefabricadas/${prefabricadaId}`);
    
    if (data?.prefabricada) {
      prefabricada.value = {
        id: data.prefabricada?.id,
        nombre_prefabricada: data.prefabricada?.nombre_prefabricada || '',
        m2: data.prefabricada?.m2 || '',
        garantia: data.prefabricada?.garantia || 'Garantía no especificada',
        eslogan: data.prefabricada?.eslogan || '',
        descripcion: data.prefabricada?.descripcion || '',
        imagenes: Array.isArray(data.prefabricada?.imagenes_prefabricadas) 
          ? data.prefabricada.imagenes_prefabricadas.map(img => img?.image || '/img/placeholder.png')
          : ['/img/placeholder.png'],
        caracteristicas: Array.isArray(data.prefabricada?.caracteristicas)
          ? data.prefabricada.caracteristicas.map(car => ({
              clave: car?.clave || 'Característica',
              valor: car?.valor || 'No especificado'
            }))
          : [],
        precios: Array.isArray(data.prefabricada?.precios)
          ? data.prefabricada.precios.map(precio => ({
              id: precio?.id,
              nombre_precio: precio?.nombre_precio || 'Plan básico',
              valor_prefabricada: precio?.valor_prefabricada || 0,
              descripcion_precio: precio?.descripcion_precio || 'Sin descripción disponible',
              incluyes: Array.isArray(precio?.incluyes)
                ? precio.incluyes.map(inc => ({
                    id: inc?.id,
                    nombre_incluye: inc?.nombre_incluye || 'Característica incluida'
                  }))
                : []
            }))
          : []
      };
    } else {
      throw new Error('No se encontró la casa prefabricada');
    }
  } catch (err) {
    error.value = "No se pudo cargar la información de la casa prefabricada.";
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
});

const openLightbox = (index) => {
  if (prefabricada.value?.imagenes?.length > 0) {
    currentImageIndex.value = index;
    lightboxOpen.value = true;
  }
};

const closeLightbox = () => {
  lightboxOpen.value = false;
};

const prevImage = () => {
  if (prefabricada.value?.imagenes?.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + prefabricada.value.imagenes.length) % prefabricada.value.imagenes.length;
  }
};

const nextImage = () => {
  if (prefabricada.value?.imagenes?.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % prefabricada.value.imagenes.length;
  }
};

const getFeatureIcon = (clave) => {
  const iconMap = {
    'Dormitorios': 'fas fa-bed',
    'dormitorios': 'fas fa-bed',
    'Baños': 'fas fa-bath',
    'baños': 'fas fa-bath',
    'Cocina': 'fas fa-utensils',
    'cocina': 'fas fa-utensils',
    'Sala': 'fas fa-couch',
    'sala': 'fas fa-couch',
    'Living': 'fas fa-couch',
    'living': 'fas fa-couch',
    'Sala de estar': 'fas fa-couch',
    'sala de estar': 'fas fa-couch',
    'Comedor': 'fas fa-chair',
    'comedor': 'fas fa-chair',
    'Eficiencia energética': 'fas fa-leaf',
    'Materiales': 'fas fa-hard-hat',
    'materiales': 'fas fa-hard-hat',
    'Material': 'fas fa-hard-hat',
    'material': 'fas fa-hard-hat',
    'Diseño': 'fas fa-pencil-ruler',
  };
  return iconMap[clave] || 'fas fa-check';
};
</script>

<template>
  <div class="prefabricada-details">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <i class="fas fa-circle-notch fa-spin fa-3x text-primary"></i>
      <p class="mt-3">Cargando detalles...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger m-4">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else-if="prefabricada" class="animate__animated animate__fadeIn">
      <!-- Hero Section -->
      <section class="hero-section py-5 bg-light">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold text-primary mb-3">
                {{ prefabricada.nombre_prefabricada }}
              </h1>
              <p class="lead mb-4 animate__animated animate__fadeInLeft animate__delay-1s">{{ prefabricada.eslogan }}</p>
              <div class="d-flex align-items-center mb-4">
                <i class="fas fa-ruler-combined fa-2x text-primary me-3"></i>
                <div>
                  <h5 class="mb-0">Espacio</h5>
                  <p class="mb-0">{{ prefabricada.m2 }} m2</p>
                </div>
              </div>
              <div class="d-flex align-items-center mb-4">
                <i class="fas fa-shield-alt fa-2x text-primary me-3"></i>
                <div>
                  <h5 class="mb-0">Garantía</h5>
                  <p class="mb-0">{{ prefabricada.garantia }}</p>
                </div>
              </div>
              <a v-if="prefabricada.precios?.length" 
                 href="#precios" 
                 class="btn btn-primary btn-lg">
                Ver Opciones de Precios
              </a>
            </div>

            <!-- Image Carousel -->
            <div v-if="prefabricada.imagenes?.length" class="col-lg-6">
              <div id="imageCarousel" class="carousel slide shadow-lg rounded" data-bs-ride="carousel"  v-touch:swipe.left="nextImage"
              v-touch:swipe.right="prevImage">
                <!-- Add Indicators -->
                <div class="carousel-indicators">
                  <button v-for="(imagen, index) in prefabricada.imagenes"
                          :key="index"
                          type="button"
                          data-bs-target="#imageCarousel"
                          :data-bs-slide-to="index"
                          :class="{ active: index === 0 }"
                          :aria-current="index === 0"
                          :aria-label="`Slide ${index + 1}`">
                  </button>
                </div>

                <!-- Carousel Items -->
                <div class="carousel-inner">
                  <div v-for="(imagen, index) in prefabricada.imagenes" 
                      :key="index"
                      class="carousel-item"
                      :class="{ active: index === 0 }">
                    <img :src="imagen" 
                        :alt="`Vista ${index + 1}`"
                        class="d-block w-100"
                        @click="openLightbox(index)">
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Description Section -->
    <section v-if="prefabricada.descripcion && prefabricada.descripcion.trim().length" 
            class="py-5 bg-white">
      <div class="container">
        <h2 class="text-center mb-5 fw-bold text-primary">Descripción</h2>
        <p class="text-muted">{{ prefabricada.descripcion }}</p>
      </div>
    </section>


      <!-- Features Section -->
      <section v-if="prefabricada.caracteristicas?.length" 
               class="features-section py-5 bg-white">
        <div class="container">
          <h2 class="text-center mb-5 fw-bold text-primary">Características Destacadas</h2>
          <div class="row">
            <div v-for="(caracteristica, index) in prefabricada.caracteristicas" 
                 :key="index"
                 class="col-md-4 mb-4">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                  <div class="feature-icon mb-3">
                    <i :class="getFeatureIcon(caracteristica.clave)" class="fa-2x text-primary"></i>
                  </div>
                  <h5 class="card-title">{{ caracteristica.clave }}</h5>
                  <p class="card-text">{{ caracteristica.valor }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section v-if="prefabricada.precios?.length"
               id="precios" 
               class="pricing-section py-5 bg-dark text-white">
        <div class="container">
          <h2 class="text-center mb-5 fw-bold">Precios Disponibles</h2>
          <div class="row">
            <div v-for="(precio, index) in prefabricada.precios" 
                 :key="precio.id" 
                 class="col-lg-4 mb-4">
              <div class="card h-100 bg-transparent border-light">
                <div class="card-header bg-primary text-white text-center py-4">
                  <h3 class="card-title mb-0">{{ precio.nombre_precio }}</h3>
                </div>
                <div class="card-body text-light">
                  <h2 class="card-price text-center mb-4">
                    <span class="period">desde</span>
                    ${{ precio.valor_prefabricada.toLocaleString() }}
                  </h2>
                  <p class="text-center mb-4">{{ precio.descripcion_precio }}</p>
                  <ul v-if="precio.incluyes?.length" class="list-unstyled mb-4">
                    <li v-for="incluye in precio.incluyes" 
                        :key="incluye.id" 
                        class="mb-3">
                      <i class="fa-regular fa-circle text-light me-2"></i>
                      {{ incluye.nombre_incluye }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <EjecutivosVentas />

      <!-- Lightbox -->
      <div v-if="lightboxOpen && prefabricada.imagenes?.length" 
     class="lightbox" 
     @click="closeLightbox"
     v-touch:swipe.left="nextImage"
     v-touch:swipe.right="prevImage">
  <button class="close-button" @click="closeLightbox">
    <i class="fas fa-times"></i>
  </button>
  <button class="nav-button prev" @click.stop="prevImage">
    <i class="fas fa-chevron-left"></i>
  </button>
  <button class="nav-button next" @click.stop="nextImage">
    <i class="fas fa-chevron-right"></i>
  </button>
  <img :src="prefabricada.imagenes[currentImageIndex]" 
       :alt="`Vista ampliada ${currentImageIndex + 1}`"
       class="lightbox-image">
</div>

    </div>
  </div>
</template>

<style scoped>
.prefabricada-details {
  font-family: 'Arial', sans-serif;
}

.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.pricing-section {
  background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 123, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.close-button,
.nav-button {
  position: absolute;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 1rem;
  z-index: 1001;
}

.close-button:hover,
.nav-button:hover {
  color: #007bff;
}

.close-button {
  top: 20px;
  right: 20px;
}

.nav-button {
  top: 50%;
  transform: translateY(-50%);
}

.prev { left: 20px; }
.next { right: 20px; }

.carousel-indicators {
  margin-bottom: 0;
  bottom: -2.5rem;
}

.carousel-indicators button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #dee2e6;
  opacity: 0.5;
  transition: all 0.3s ease;
  margin: 0 5px;
}

.carousel-indicators button.active {
  background-color: #007bff;
  opacity: 1;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .hero-section {
    text-align: center;
  }

  .hero-section .btn {
    width: 100%;
    margin-top: 2rem;
  }

  .carousel {
    margin-top: 2rem;
  }

  .nav-button {
    font-size: 1.5rem;
  }
}
</style>
  