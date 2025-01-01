<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import { Carousel } from 'bootstrap'

const images = ref([])
const loading = ref(true)
const error = ref(null)
let carouselInstance = null

const fetchImages = async () => {
    try {
        // const response = await axios.get('http://localhost:8080/empresas/1/portadas/')
        const response = await axios.get('https://v1backendcasasamilia-production.up.railway.app/empresas/1/portadas/')
        images.value = response.data.portadas
        loading.value = false
    } catch (err) {
        console.error('Error al obtener las imágenes:', err)
        error.value = 'Hubo un error al cargar las imágenes. Por favor, intenta de nuevo más tarde.'
        loading.value = false
    }
}

const initCarousel = () => {
    const carouselElement = document.getElementById('mainCarousel')
    if (carouselElement) {
        carouselInstance = new Carousel(carouselElement, {
            interval: 5000,
            wrap: true,
            fade: true // Enable fade transition
        })
    }
}

onMounted(() => {
    fetchImages()
})

watch(images, () => {
    if (images.value.length > 0) {
        // Use nextTick to ensure DOM is updated before initializing carousel
        nextTick(() => {
            initCarousel()
        })
    }
})

// Cleanup carousel instance on component unmount
onUnmounted(() => {
    if (carouselInstance) {
        carouselInstance.dispose()
    }
})
</script>

<template>
    <div class="carousel-container">
        <div v-if="loading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
        <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>
        <div v-else-if="images.length > 0" id="mainCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button v-for="(img, index) in images" :key="'indicator-' + img.id" type="button"
                    :data-bs-target="'#mainCarousel'" :data-bs-slide-to="index" :class="{ active: index === 0 }"
                    :aria-current="index === 0 ? 'true' : 'false'" :aria-label="'Slide ' + (index + 1)">
                </button>
            </div>
            <div class="carousel-inner">
                <div v-for="(img, index) in images" :key="img.id" class="carousel-item"
                    :class="{ active: index === 0 }">
                    <img :src="img.image" class="d-block w-100" :alt="img.alt" @error="img.error = true">
                    <div v-if="!img.error" class="carousel-caption d-none d-md-block">
                        <h5>{{ img.nombre_portada }}</h5>
                    </div>
                    <div v-else class="carousel-caption d-none d-md-block">
                        <h5>Error loading image</h5>
                    </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
            </button>
        </div>
        <div v-else class="alert alert-info" role="alert">
            No hay imágenes disponibles para mostrar.
        </div>
    </div>
</template>

<style scoped>
.carousel-container {
    max-width: 100%;
    overflow: hidden;
}

.carousel-inner {
    max-height: 800px; /* Adjust this value as needed */
}

.carousel-item {
    height: 100%;
}

.carousel-item img {
    object-fit: cover;
    object-position: center;
    width: 100%;
    height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .carousel-inner {
        max-height: 400px; /* Adjust for smaller screens */
    }
}

@media (max-width: 576px) {
    .carousel-inner {
        max-height: 300px; /* Further adjust for mobile screens */
    }
}

/* Fade transition */
.carousel-fade .carousel-item {
    opacity: 0;
    transition-duration: .6s;
    transition-property: opacity;
}

.carousel-fade .carousel-item.active,
.carousel-fade .carousel-item-next.carousel-item-start,
.carousel-fade .carousel-item-prev.carousel-item-end {
    opacity: 1;
}

.carousel-fade .active.carousel-item-start,
.carousel-fade .active.carousel-item-end {
    opacity: 0;
}

.carousel-fade .carousel-item-next,
.carousel-fade .carousel-item-prev,
.carousel-fade .carousel-item.active,
.carousel-fade .active.carousel-item-start,
.carousel-fade .active.carousel-item-prev {
    transform: translateX(0);
    transform: translate3d(0, 0, 0);
}
</style>