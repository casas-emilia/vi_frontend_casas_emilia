<template>
    <div class="container-fluid mt-4">
      <h1 class="mb-4 text-center">Gestión de Portadas</h1>
      <p class="text-danger">*IMPORTANTE!, las imagenes deben tener un tamaño menor a 600 KB c/u, para mayor velocidad del servicio y reducción de costos en todos los sentidos. Reducir peso si es necesario en servicios en línea</p>
  
      <!-- Form for creating/updating portada -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-6">
          <form @submit.prevent="handleSubmit" class="p-4 border rounded shadow-sm">
            <h3 class="mb-3">{{ editingPortada ? 'Editar' : 'Crear' }} Portada</h3>
            <div class="mb-3">
              <label for="nombrePortada" class="form-label">Nombre de la Portada</label>
              <input
                v-model="formData.nombre_portada"
                type="text"
                class="form-control"
                id="nombrePortada"
                required
              >
            </div>
            <div class="mb-3">
              <label for="image" class="form-label">Imagen</label>
              <input
                type="file"
                class="form-control"
                id="image"
                @change="handleFileChange"
                accept="image/*"
              >
            </div>
            <button type="submit" class="btn btn-primary w-100">
              <i class="fas" :class="editingPortada ? 'fa-save' : 'fa-plus'"></i>
              {{ editingPortada ? 'Actualizar' : 'Crear' }} Portada
            </button>
          </form>
        </div>
      </div>
  
      <!-- List of portadas -->
      <div class="row">
        <div v-for="portada in portadas" :key="portada.id" class="col-md-4 col-lg-3 mb-4">
          <div class="card h-100 shadow-sm animate__animated animate__fadeIn">
            <img :src="portada.image" class="card-img-top" :alt="portada.nombre_portada">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ portada.nombre_portada }}</h5>
              <p class="card-text">Creado: {{ formatDate(portada.created_at) }}</p>
              <div class="mt-auto">
                <button @click="editPortada(portada)" class="btn btn-warning me-2">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button @click="deletePortada(portada.id)" class="btn btn-danger">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Pagination -->
      <nav v-if="totalPages > 1" aria-label="Navegación de páginas" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Anterior</a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Siguiente</a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  const empresaId = 1; // Assuming we're working with empresa ID 1
  // const baseURL = `http://localhost:8080/administracion/empresas/${empresaId}/portadas/`;
  const baseURL = `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/${empresaId}/portadas/`;
  
  const portadas = ref([]);
  const formData = ref({
    nombre_portada: '',
    image: null
  });
  const editingPortada = ref(null);
  const currentPage = ref(1);
  const itemsPerPage = 12;
  const totalItems = ref(0);
  
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
  
  const fetchPortadas = async (page = 1) => {
    try {
      const response = await axios.get(`${baseURL}?page=${page}&limit=${itemsPerPage}`);
      portadas.value = response.data.portadas;
      totalItems.value = response.data.total || response.data.portadas.length;
      currentPage.value = page;
    } catch (error) {
      console.error('Error fetching portadas:', error);
      Swal.fire('Error', 'No se pudieron cargar las portadas', 'error');
    }
  };
  
  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append('nombre_portada', formData.value.nombre_portada);
      if (formData.value.image) {
        data.append('image', formData.value.image);
      }
  
      let response;
      if (editingPortada.value) {
        response = await axios.put(`${baseURL}${editingPortada.value.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire('Éxito', 'Portada actualizada correctamente', 'success');
      } else {
        response = await axios.post(baseURL, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire('Éxito', 'Portada creada correctamente', 'success');
      }
  
      console.log('Server response:', response.data);
  
      resetForm();
      fetchPortadas(currentPage.value);
    } catch (error) {
      console.error('Error submitting portada:', error);
      let errorMessage = 'No se pudo guardar la portada';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      Swal.fire('Error', errorMessage, 'error');
    }
  };
  
  const handleFileChange = (event) => {
    formData.value.image = event.target.files[0];
  };
  
  const editPortada = (portada) => {
    editingPortada.value = portada;
    formData.value.nombre_portada = portada.nombre_portada;
  };
  
  const deletePortada = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      });
  
      if (result.isConfirmed) {
        await axios.delete(`${baseURL}${id}`);
        Swal.fire('Eliminado', 'La portada ha sido eliminada', 'success');
        fetchPortadas(currentPage.value);
      }
    } catch (error) {
      console.error('Error deleting portada:', error);
      Swal.fire('Error', 'No se pudo eliminar la portada', 'error');
    }
  };
  
  const resetForm = () => {
    formData.value = { nombre_portada: '', image: null };
    editingPortada.value = null;
  };
  
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      fetchPortadas(page);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  onMounted(() => fetchPortadas());
  </script>
  
  <style scoped>
/*   @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  @import 'animate.css'; */
  
  .card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .btn {
    transition: all 0.3s ease;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .card-img-top {
    height: 200px;
    object-fit: cover;
  }
  </style>