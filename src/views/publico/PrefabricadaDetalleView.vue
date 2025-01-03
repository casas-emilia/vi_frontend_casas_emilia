<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import EjecutivosVentas from "@/components/EjecutivosVentas.vue";

const prefabricada = ref(null);
const loading = ref(true);
const error = ref(null);
const lightboxOpen = ref(false);
const currentImageIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);
const SWIPE_THRESHOLD = 50;

const route = useRoute();
const baseURL = "https://v1backendcasasamilia-production.up.railway.app/empresas/1";

// Función para manejar errores de carga de imágenes
const handleImageError = (event) => {
  event.target.src = '/img/placeholder.png';
};

// Mejorado el manejo de gestos táctiles
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
};

const handleTouchEnd = (event) => {
  touchEndX.value = event.changedTouches[0].clientX;
  const swipeDistance = touchEndX.value - touchStartX.value;

  if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
    if (swipeDistance > 0) {
      prevImage();
    } else {
      nextImage();
    }
  }
};

// Control de imágenes mejorado
const updateImageIndex = (newIndex) => {
  if (!prefabricada.value?.imagenes?.length) return;
  
  const totalImages = prefabricada.value.imagenes.length;
  currentImageIndex.value = ((newIndex % totalImages) + totalImages) % totalImages;
};

const prevImage = () => {
  updateImageIndex(currentImageIndex.value - 1);
};

const nextImage = () => {
  updateImageIndex(currentImageIndex.value + 1);
};

// Optimizado el manejo de datos
const processData = (data) => {
  if (!data?.prefabricada) throw new Error('No se encontró la casa prefabricada');

  return {
    id: data.prefabricada.id,
    nombre_prefabricada: data.prefabricada.nombre_prefabricada || '',
    m2: data.prefabricada.m2 || '',
    garantia: data.prefabricada.garantia || 'Garantía no especificada',
    eslogan: data.prefabricada.eslogan || '',
    descripcion: data.prefabricada.descripcion || '',
    imagenes: Array.isArray(data.prefabricada.imagenes_prefabricadas) 
      ? data.prefabricada.imagenes_prefabricadas.map(img => img?.image || '/img/placeholder.png')
      : ['/img/placeholder.png'],
    caracteristicas: Array.isArray(data.prefabricada.caracteristicas)
      ? data.prefabricada.caracteristicas.map(car => ({
          clave: car?.clave || 'Característica',
          valor: car?.valor || 'No especificado'
        }))
      : [],
    precios: Array.isArray(data.prefabricada.precios)
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
};

// Carga de datos mejorada con manejo de errores
onMounted(async () => {
  const prefabricadaId = route.params.id;
  try {
    loading.value = true;
    const { data } = await axios.get(`${baseURL}/prefabricadas/${prefabricadaId}`);
    prefabricada.value = processData(data);
  } catch (err) {
    error.value = "No se pudo cargar la información de la casa prefabricada.";
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
});

const getFeatureIcon = (clave) => {
  const iconMap = {
    'dormitorios': 'fas fa-bed',
    'baños': 'fas fa-bath',
    'cocina': 'fas fa-utensils',
    'sala': 'fas fa-couch',
    'living': 'fas fa-couch',
    'comedor': 'fas fa-chair',
    'eficiencia energética': 'fas fa-leaf',
    'materiales': 'fas fa-hard-hat',
    'material': 'fas fa-hard-hat',
    'diseño': 'fas fa-pencil-ruler',
  };
  return iconMap[clave.toLowerCase()] || 'fas fa-check';
};

// Manejo del lightbox
const openLightbox = (index) => {
  if (prefabricada.value?.imagenes?.length > 0) {
    currentImageIndex.value = index;
    lightboxOpen.value = true;
    document.body.style.overflow = 'hidden';
  }
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
};

// Limpieza al desmontar
onUnmounted(() => {
  document.body.style.overflow = '';
});
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
            <!-- Info Column -->
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold text-primary mb-3">
                {{ prefabricada.nombre_prefabricada }}
              </h1>
              <p class="lead mb-4">{{ prefabricada.eslogan }}</p>
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
              <div class="carousel-container"
                   @touchstart="handleTouchStart"
                   @touchend="handleTouchEnd">
                <div class="carousel-inner">
                  <div v-for="(imagen, index) in prefabricada.imagenes" 
                       :key="index"
                       class="carousel-item"
                       :class="{ active: currentImageIndex === index }"
                       @click="openLightbox(index)">
                    <img :src="imagen" 
                         :alt="`Vista ${index + 1}`"
                         @error="handleImageError"
                         class="d-block w-100">
                  </div>
                </div>

                <!-- Navigation Controls -->
                <button class="carousel-control prev" @click.stop="prevImage">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-control next" @click.stop="nextImage">
                  <i class="fas fa-chevron-right"></i>
                </button>

                <!-- Indicators -->
                <div class="carousel-indicators">
                  <button v-for="(_, index) in prefabricada.imagenes"
                          :key="index"
                          :class="{ active: currentImageIndex === index }"
                          @click="currentImageIndex = index">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Rest of the sections remain the same -->
      <!-- ... -->

      <!-- Lightbox -->
      <div v-if="lightboxOpen" 
           class="lightbox"
           @click="closeLightbox"
           @touchstart="handleTouchStart"
           @touchend="handleTouchEnd">
        <button class="close-button" @click.stop="closeLightbox">
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
             @error="handleImageError"
             class="lightbox-image"
             @click.stop>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos existentes... */

/* Mejoras en el carrusel */
.carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* Mantiene una relación de aspecto 4:3 */
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.carousel-item.active {
  opacity: 1;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 2;
}

.carousel-control:hover {
  background: rgba(0, 0, 0, 0.7);
}

.carousel-control.prev { left: 0; border-radius: 0 4px 4px 0; }
.carousel-control.next { right: 0; border-radius: 4px 0 0 4px; }

/* Mejoras en el lightbox */
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
  touch-action: none;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .carousel-control {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 80vh;
  }

  .nav-button {
    padding: 0.5rem;
    font-size: 1.2rem;
  }
}
</style>