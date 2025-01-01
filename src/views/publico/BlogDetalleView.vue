<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Redes from '@/components/Redes.vue';
import { Carousel } from 'bootstrap';

const route = useRoute();
const router = useRouter();
const actividad = ref(null);
const loading = ref(true);
const error = ref(null);
const carouselInstance = ref(null);
const isModalVisible = ref(false);
const selectedImage = ref(null);

const showModal = (image) => {
    selectedImage.value = image;
    isModalVisible.value = true;
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    isModalVisible.value = false;
    selectedImage.value = null;
    document.body.style.overflow = 'auto';
};

const obtenerImagenesDeNoticia = async (noticiaId) => {
    try {
        // const imagenesResponse = await axios.get(`http://localhost:8080/empresas/1/noticiasEmpresa/${noticiaId}/imagenesNoticiasEmpresa/`);
        const imagenesResponse = await axios.get(`https://v1backendcasasamilia-production.up.railway.app/empresas/1/noticiasEmpresa/${noticiaId}/imagenesNoticiasEmpresa/`);
        const imagenes = imagenesResponse.data.imagenes_noticia || [];
        return imagenes.length > 0 ? imagenes : [{ image: '/img/placeholder.png' }];
    } catch (error) {
        console.error('Error fetching images:', error);
        return [{ image: '/img/placeholder.png' }];
    }
};

const getActividadDetalle = async () => {
    try {
        // const noticiasResponse = await axios.get(`http://localhost:8080/empresas/1/noticiasEmpresa/${route.params.id}`);
        const noticiasResponse = await axios.get(`https://v1backendcasasamilia-production.up.railway.app/empresas/1/noticiasEmpresa/${route.params.id}`);
        const noticia = noticiasResponse.data.noticia || {};
        const imagenes = await obtenerImagenesDeNoticia(noticia.id);
        actividad.value = { ...noticia, imagenes };
    } catch (error) {
        console.error('Error fetching data:', error);
        error.value = 'Error al cargar la actividad. Por favor, intente de nuevo más tarde.';
    } finally {
        loading.value = false;
    }
};

const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const opciones = { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-CL', opciones);
};

const initCarousel = () => {
    const carouselElement = document.getElementById('carouselExample');
    if (carouselElement) {
        carouselInstance.value = new Carousel(carouselElement, {
            interval: 5000,
            wrap: true
        });
    }
};

onMounted(() => {
    getActividadDetalle();
});

watch(actividad, () => {
    if (actividad.value && actividad.value.imagenes.length > 0) {
        nextTick(() => {
            initCarousel();
        });
    }
});

onUnmounted(() => {
    if (carouselInstance.value) {
        carouselInstance.value.dispose();
    }
});

const goBack = () => {
    router.go(-1);
};
</script>

<template>
    <div class="detail-view">
        <!-- Header -->
        <header class="detail-header">
            <div class="container">
                <nav class="breadcrumb-nav">
                    <button class="back-button" @click="goBack">
                        <span class="back-icon">←</span>
                        <span>Volver</span>
                    </button>
                </nav>
            </div>
        </header>

        <main class="detail-content">
            <div class="container">
                <!-- Loading State -->
                <div v-if="loading" class="loading-state">
                    <div class="loader"></div>
                    <p>Cargando contenido...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="error-state">
                    <div class="error-icon">⚠️</div>
                    <p>{{ error }}</p>
                    <button @click="getActividadDetalle" class="retry-button">
                        Intentar nuevamente
                    </button>
                </div>

                <!-- Content -->
                <article v-else-if="actividad" class="article-content">
                    <div class="article-header">
                        <h1>{{ actividad.titulo_noticia }}</h1>
                        <time :datetime="actividad.created_at">
                            {{ formatearFecha(actividad.created_at) }}
                        </time>
                    </div>

                    <!-- Image Carousel -->
                    <div class="carousel-wrapper">
                        <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">

                                <!-- Add Indicators -->
                                <div class="carousel-indicators">
                                <button v-for="(imagen, index) in actividad.imagenes"
                                        :key="index"
                                        type="button"
                                        data-bs-target="#imageCarousel"
                                        :data-bs-slide-to="index"
                                        :class="{ active: index === 0 }"
                                        :aria-current="index === 0"
                                        :aria-label="`Slide ${index + 1}`">
                                </button>
                                </div>

                                <div
                                    v-for="(imagen, index) in actividad.imagenes"
                                    :key="index"
                                    class="carousel-item"
                                    :class="{ active: index === 0 }"
                                >
                                    <div class="image-container" @click="showModal(imagen.image)">
                                        <img
                                            :src="imagen.image"
                                            :alt="`Imagen ${index + 1} de ${actividad.titulo_noticia}`"
                                            class="carousel-image"
                                        />
                                        <div class="image-overlay">
                                            <span class="zoom-icon">🔍</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button class="carousel-control prev" data-bs-target="#carouselExample" data-bs-slide="prev">
                                <span class="carousel-arrow">←</span>
                            </button>
                            <button class="carousel-control next" data-bs-target="#carouselExample" data-bs-slide="next">
                                <span class="carousel-arrow">→</span>
                            </button>
                        </div>
                    </div>

                    <!-- Article Content -->
                    <div class="article-body">
                        <p>{{ actividad.desarrollo_noticia }}</p>
                    </div>
                </article>

                <div v-else class="no-content">
                    <p>No se encontró información para esta actividad.</p>
                    <button @click="goBack" class="back-button">Volver al listado</button>
                </div>
            </div>
        </main>

        <!-- Image Modal -->
        <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
            <div class="modal-container" @click.stop>
                <img :src="selectedImage" :alt="actividad?.titulo_noticia" />
                <button class="modal-close" @click="closeModal">×</button>
            </div>
        </div>
    </div>
    <Redes />
</template>

<style scoped>
.detail-view {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    min-height: 100vh;
}

/* Header Styles */
.detail-header {
    background: white;
    padding: 1.5rem 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.breadcrumb-nav {
    display: flex;
    align-items: center;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    color: #4a5568;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.back-button:hover {
    color: #2d3748;
    transform: translateX(-4px);
}

.back-icon {
    font-size: 1.2rem;
}

/* Content Styles */
.detail-content {
    padding: 2rem 0;
}

.article-content {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

.article-header {
    padding: 2rem;
    background: linear-gradient(135deg, #2c5282 0%, #2b6cb0 100%);
    color: white;
}

.article-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.article-header time {
    font-size: 0.9rem;
    opacity: 0.9;
}

/* Carousel Styles */
.carousel-wrapper {
    position: relative;
    background: #000;
}

.carousel-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
}

.image-container {
    position: relative;
    cursor: zoom-in;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
}

.image-container:hover .image-overlay {
    opacity: 1;
}

.zoom-icon {
    font-size: 2rem;
    color: white;
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    background: rgba(255,255,255,0.9);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.carousel-control:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
}

.prev { left: 20px; }
.next { right: 20px; }

.carousel-arrow {
    font-size: 1.5rem;
    color: #2d3748;
}

/* Article Body */
.article-body {
    padding: 2rem;
    font-size: 1.1rem;
    line-height: 1.8;
    color: #2d3748;
}

/* Loading State */
.loading-state {
    text-align: center;
    padding: 4rem 0;
}

.loader {
    width: 50px;
    height: 50px;
    border: 4px solid #e2e8f0;
    border-top-color: #4299e1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

/* Error State */
.error-state {
    text-align: center;
    padding: 4rem 0;
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.retry-button {
    background: #4299e1;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.retry-button:hover {
    background: #2b6cb0;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-container {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
}

.modal-container img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
}

.modal-close {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 40px;
    height: 40px;
    background: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: #e53e3e;
    color: white;
    transform: rotate(90deg);
}

/* Animations */
@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .article-header h1 {
        font-size: 2rem;
    }

    .carousel-image {
        height: 300px;
    }

    .carousel-control {
        width: 40px;
        height: 40px;
    }

    .modal-close {
        top: 10px;
        right: 10px;
    }
}

@media (max-width: 480px) {
    .article-header h1 {
        font-size: 1.5rem;
    }

    .article-body {
        font-size: 1rem;
        padding: 1.5rem;
    }
}
</style>