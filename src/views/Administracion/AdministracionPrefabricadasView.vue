<template>
    <div class="container-fluid py-4 bg-light">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm">
            <div class="card-body">
              <h1 class="text-center mb-4 text-primary">Administrar Prefabricadas</h1>
  
              <!-- Filtros y Búsqueda -->
              <div class="row mb-3">
                <div class="col-md-6 mb-2 mb-md-0">
                  <div class="input-group">
                    <input
                      v-model="searchTerm"
                      type="text"
                      class="form-control"
                      placeholder="Buscar por nombre o categoría"
                    />
                    <button @click="applyFilters" class="btn btn-outline-secondary">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <select v-model="sortBy" @change="applyFilters" class="form-select">
                    <option value="">Ordenar por</option>
                    <option value="id">ID</option>
                    <option value="nombre_prefabricada">Nombre</option>
                  </select>
                </div>
              </div>
  
              <!-- Botón para crear una nueva prefabricada -->
              <button class="btn btn-success mb-3" @click="openModal('create')">
                <i class="fas fa-plus-circle"></i> Crear Prefabricada
              </button>
  
              <!-- Tabla de Prefabricadas -->
              <div v-if="filteredPrefabricadas.length > 0" class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>M2</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="prefabricada in filteredPrefabricadas"
                      :key="prefabricada.id"
                    >
                      <td>{{ prefabricada.id }}</td>
                      <td>{{ prefabricada.nombre_prefabricada }}</td>
                      <td>{{ prefabricada.m2 }}</td>
                      <td>{{ getCategoriaName(prefabricada.categoria_id) }}</td>
                      <td>
                        <button
                          class="btn btn-secondary btn-sm me-2"
                          @click="manageDetails(prefabricada)"
                        >
                          <i class="fas fa-cogs"></i> Administrar
                        </button>
                        <button
                          class="btn btn-danger btn-sm"
                          @click="deletePrefabricada(prefabricada.id)"
                        >
                          <i class="fas fa-trash-alt"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="alert alert-warning text-center">
                <i class="fas fa-exclamation-triangle"></i> No hay datos disponibles
              </div>
  
              <!-- Modal de Crear/Editar Prefabricadas -->
              <Teleport to="body">
                <div v-if="showModal" class="modal-backdrop" @click="closeModal"></div>
                <div v-if="showModal" class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                          {{ modalMode === 'create' ? 'Crear Prefabricada' : 'Editar Prefabricada' }}
                        </h5>
                        <button class="btn-close btn-close-white" @click="closeModal"></button>
                      </div>
                      <div class="modal-body">
                        <form @submit.prevent="savePrefabricada">
                          <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input v-model="form.nombre_prefabricada" type="text" class="form-control" required />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">M2</label>
                            <input v-model="form.m2" type="number" class="form-control" required />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Categoría</label>
                            <select v-model="form.categoria_id" class="form-select" required>
                              <option value="" disabled>Seleccione una categoría</option>
                              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                                {{ categoria.nombre_categoria }}
                              </option>
                            </select>
                          </div>
                          <div class="mb-3">
  <label class="form-label">Garantía (en años)</label>
  <input
    v-model="form.garantia"
    type="text"
    class="form-control"
    placeholder="Ingrese la garantía en años"
    required
  />
</div>
<div class="mb-3">
  <label class="form-label">Estilo</label>
  <select v-model="form.estilo_id" class="form-select" required>
    <option value="" disabled>Seleccione un estilo</option>
    <option v-for="estilo in estilos" :key="estilo.id" :value="estilo.id">
      {{ estilo.nombre_estilo }}
    </option>
  </select>
</div>
<div class="mb-3">
  <label class="form-label">Tipo</label>
  <select v-model="form.tipo_id" class="form-select" required>
    <option value="" disabled>Seleccione un tipo</option>
    <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">
      {{ tipo.material_estructura }}
    </option>
  </select>
</div>

                          <div class="d-grid">
                            <button class="btn btn-success" type="submit">
                              {{ modalMode === 'create' ? 'Crear' : 'Actualizar' }}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Teleport>
  
              <!-- Modal de Detalles -->
              <Teleport to="body">
                <div v-if="showDetails" class="modal-backdrop" @click="closeDetails"></div>
                <div v-if="showDetails" class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                      <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Administrar {{ selectedPrefabricada.nombre_prefabricada }}</h5>
                        <button class="btn-close btn-close-white" @click="closeDetails"></button>
                      </div>
                      <div class="modal-body">
                        <b-tabs>
                          <!-- Imágenes -->
                          <b-tab title="Imágenes" active>
                            <h5>Imágenes</h5>
                            <div>
                              <input
                                type="file"
                                class="form-control mb-2"
                                @change="uploadImage"
                                accept="image/*"
                              />
                              <div class="d-flex flex-wrap gap-2">
                                <div
                                  v-for="image in selectedPrefabricada.imagenes_prefabricadas"
                                  :key="image.id"
                                  class="border rounded p-2"
                                >
                                  <img :src="image.image" alt="Imagen" class="img-thumbnail" />
                                  <button
                                    class="btn btn-sm btn-danger mt-2"
                                    @click="deleteImage(image.id)"
                                  >
                                    <i class="fas fa-trash-alt"></i> Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </b-tab>
  
                          <!-- Características -->
                          <b-tab title="Características">
                            <h5>Características</h5>
                            <div>
                              <div v-for="(caracteristica, index) in selectedPrefabricada.caracteristicas" :key="caracteristica.id">
                                <div class="input-group mb-2">
                                  <input
                                    type="text"
                                    v-model="caracteristica.clave"
                                    class="form-control"
                                    placeholder="Clave"
                                  />
                                  <input
                                    type="text"
                                    v-model="caracteristica.valor"
                                    class="form-control"
                                    placeholder="Valor"
                                  />
                                  <button
                                    class="btn btn-danger"
                                    @click="deleteCaracteristica(caracteristica.id)"
                                  >
                                    <i class="fas fa-trash-alt"></i>
                                  </button>
                                </div>
                              </div>
                              <button class="btn btn-outline-primary" @click="addCaracteristica">
                                <i class="fas fa-plus-circle"></i> Agregar Característica
                              </button>
                            </div>
                          </b-tab>
  
                          <!-- Precios -->
                          <b-tab title="Precios">
                            <h5>Precios</h5>
                            <div>
                              <div
                                v-for="(precio, index) in selectedPrefabricada.precios"
                                :key="precio.id"
                              >
                                <div class="input-group mb-2">
                                  <input
                                    type="text"
                                    v-model="precio.nombre_precio"
                                    class="form-control"
                                    placeholder="Nombre del Precio"
                                  />
                                  <input
                                    type="number"
                                    v-model="precio.valor_prefabricada"
                                    class="form-control"
                                    placeholder="Valor"
                                  />
                                  <button
                                    class="btn btn-danger"
                                    @click="deletePrecio(precio.id)"
                                  >
                                    <i class="fas fa-trash-alt"></i>
                                  </button>
                                </div>
  
                                <!-- Incluyes -->
                                <div>
                                  <h6>Incluye:</h6>
                                  <div
                                    v-for="incluye in precio.incluyes"
                                    :key="incluye.id"
                                    class="d-flex align-items-center mb-1"
                                  >
                                    <input
                                      v-model="incluye.nombre_incluye"
                                      class="form-control"
                                      placeholder="Nombre"
                                    />
                                    <button
                                      class="btn btn-outline-danger btn-sm ms-2"
                                      @click="deleteIncluye(incluye.id)"
                                    >
                                      <i class="fas fa-trash"></i>
                                    </button>
                                  </div>
                                  <button
                                    class="btn btn-outline-secondary btn-sm"
                                    @click="addIncluye(precio.id)"
                                  >
                                    <i class="fas fa-plus"></i> Agregar Incluye
                                  </button>
                                </div>
                              </div>
                              <button class="btn btn-outline-primary" @click="addPrecio">
                                <i class="fas fa-plus-circle"></i> Agregar Precio
                              </button>
                            </div>
                          </b-tab>
                        </b-tabs>
                      </div>
                    </div>
                  </div>
                </div>
              </Teleport>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import axios from "axios";
import { ref, reactive, onMounted } from "vue";

export default {
  setup() {
    const prefabricadas = ref([]);
    const categorias = ref([]);
    const estilos = ref([]);
    const tipos = ref([]);
    const filteredPrefabricadas = ref([]);
    const searchTerm = ref("");
    const sortBy = ref("");
    const showModal = ref(false);
    const showDetails = ref(false);
    const modalMode = ref("create");

    const form = reactive({
      id: null,
      nombre_prefabricada: "",
      m2: null,
      categoria_id: "",
      garantia: null,
      estilo_id: "",
      tipo_id: "",
    });

    const selectedPrefabricada = reactive({
      id: null,
      nombre_prefabricada: "",
      m2: null,
      categoria_id: "",
      garantia: null,
      estilo_id: "",
      tipo_id: "",
      imagenes_prefabricadas: [],
      caracteristicas: [],
      precios: [],
    });

    // Fetch Prefabricadas
    const fetchPrefabricadas = async () => {
      try {
        // const { data } = await axios.get("http://localhost:8080/administracion/empresas/1/prefabricadas/");
        const { data } = await axios.get("https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/");
        prefabricadas.value = data.prefabricadas;
        applyFilters();
      } catch (error) {
        console.error("Error al obtener prefabricadas:", error);
      }
    };

    // Fetch Categorías
    const fetchCategorias = async () => {
      try {
        // const { data } = await axios.get("http://localhost:8080/administracion/categorias/");
        const { data } = await axios.get("https://v1backendcasasamilia-production.up.railway.app/administracion/categorias/");
        categorias.value = data.categorias;
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    // Fetch Estilos
    const fetchEstilos = async () => {
      try {
        // const { data } = await axios.get("http://localhost:8080/administracion/estilos/");
        const { data } = await axios.get("https://v1backendcasasamilia-production.up.railway.app/administracion/estilos/");
        estilos.value = data.estilos;
      } catch (error) {
        console.error("Error al obtener estilos:", error);
      }
    };

    // Fetch Tipos
    const fetchTipos = async () => {
      try {
        // const { data } = await axios.get("http://localhost:8080/administracion/tipos/");
        const { data } = await axios.get("https://v1backendcasasamilia-production.up.railway.app/administracion/tipos/");
        tipos.value = data.tipos;
      } catch (error) {
        console.error("Error al obtener tipos:", error);
      }
    };

    const deletePrefabricada = async (id) => {
    try {
        // await axios.delete(`http://localhost:8080/administracion/empresas/1/prefabricadas/${id}`);
        await axios.delete(`https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/${id}`);
        fetchPrefabricadas(); // Recargar la lista de prefabricadas después de eliminar
    } catch (error) {
        console.error("Error al eliminar prefabricada:", error);
    }
    };

    const deleteImage = async (id) => {
    try {
        await axios.delete(
        // `http://localhost:8080/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/imagenesPrefabricadas/${id}`
        `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/imagenesPrefabricadas/${id}`
        );
        fetchPrefabricadas();
    } catch (error) {
        console.error("Error al eliminar imagen:", error);
    }
    };

    const deleteCaracteristica = async (caracteristicaId) => {
    try {
        await axios.delete(
        // `http://localhost:8080/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/caracteristicas/${caracteristicaId}`
        `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/caracteristicas/${caracteristicaId}`
        );
        fetchPrefabricadas();
    } catch (error) {
        console.error("Error al eliminar característica:", error);
    }
    };

    const deletePrecio = async (precioId) => {
    try {
        await axios.delete(
        // `http://localhost:8080/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/precios/${precioId}`
        `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/precios/${precioId}`
        );
        fetchPrefabricadas();
    } catch (error) {
        console.error("Error al eliminar precio:", error);
    }
    };

    const deleteIncluye = async (incluyeId) => {
    try {
        // Buscar el precio que contiene el incluye con el id proporcionado
        const precio = selectedPrefabricada.precios.find((p) =>
        p.incluyes.some((i) => i.id === incluyeId)
        );

        if (!precio) {
        console.error("No se encontró el precio que contiene el incluye especificado.");
        return;
        }

        const precioId = precio.id; // Extraer el ID del precio

        // Llamar a la API con el precioId y el incluyeId
        await axios.delete(
        // `http://localhost:8080/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/precios/${precioId}/incluyes/${incluyeId}`
        `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/precios/${precioId}/incluyes/${incluyeId}`
        );

        fetchPrefabricadas();
    } catch (error) {
        console.error("Error al eliminar incluye:", error);
    }
    };

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(
            // `http://localhost:8080/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/imagenesPrefabricadas/`,
            `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/imagenesPrefabricadas/`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
            );
            selectedPrefabricada.imagenes_prefabricadas.push(response.data);
        } catch (error) {
            console.error("Error al subir la imagen:", error);
        }
        };

     // Gestión de características
const addCaracteristica = async () => {
  selectedPrefabricada.caracteristicas.push({ clave: "", valor: "" });

  try {
    // await axios.put(`http://localhost:8080/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/caracteristicas/`, {
    await axios.put(`https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/${selectedPrefabricada.id}/caracteristicas/`, {
      caracteristicas: selectedPrefabricada.caracteristicas,
    });
    alert("Característica agregada con éxito.");
  } catch (error) {
    console.error("Error al agregar característica:", error);
    alert("Hubo un problema al agregar la característica.");
  }
};

// Gestión de precios
const addPrecio = async () => {
  selectedPrefabricada.precios.push({ nombre_precio: "", valor_prefabricada: 0, incluyes: [] });

  try {
    // await axios.put(`http://localhost:8080/administracion/empresas/1/prefabricadas/2/precios/`, {
    await axios.put(`https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/1/prefabricadas/2/precios/`, {  
      precios: selectedPrefabricada.precios,
    });
    alert("Precio agregado con éxito.");
  } catch (error) {
    console.error("Error al agregar precio:", error);
    alert("Hubo un problema al agregar el precio.");
  }
};

// Función para agregar un nuevo incluye a un precio
const addIncluye = async (precioId) => {
  const precio = selectedPrefabricada.precios.find(p => p.id === precioId);
  precio.incluyes.push({ nombre_incluye: "" });

  try {
    await axios.put(`/api/prefabricadas/${selectedPrefabricada.id}/precios/${precioId}/incluyes`, {
      incluyes: precio.incluyes,
    });
    alert("Incluye agregado con éxito.");
  } catch (error) {
    console.error("Error al agregar incluye:", error);
    alert("Hubo un problema al agregar el incluye.");
  }
};




    // Filtrar prefabricadas
    const applyFilters = () => {
      let results = [...prefabricadas.value];
      if (searchTerm.value) {
        results = results.filter(p =>
          p.nombre_prefabricada.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
      }
      if (sortBy.value) {
        results.sort((a, b) => (a[sortBy.value] > b[sortBy.value] ? 1 : -1));
      }
      filteredPrefabricadas.value = results;
    };

    // Modal Crear/Editar Prefabricada
    const openModal = (mode, prefabricada = null) => {
      modalMode.value = mode;
      if (prefabricada) {
        Object.assign(form, { ...prefabricada });
      } else {
        Object.assign(form, {
          id: null,
          nombre_prefabricada: "",
          m2: null,
          categoria_id: "",
          garantia: null,
          estilo_id: "",
          tipo_id: "",
        });
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const savePrefabricada = async () => {
      try {
        const url =
          modalMode.value === "create"
            ? "http://localhost:8080/administracion/empresas/1/prefabricadas/"
            : `http://localhost:8080/administracion/empresas/1/prefabricadas/${form.id}`;
        const method = modalMode.value === "create" ? "post" : "put";

        await axios[method](url, {
          nombre_prefabricada: form.nombre_prefabricada,
          m2: form.m2,
          categoria_id: form.categoria_id,
          garantia: form.garantia,
          estilo_id: form.estilo_id,
          tipo_id: form.tipo_id,
        });

        fetchPrefabricadas();
        closeModal();
      } catch (error) {
        console.error("Error al guardar la prefabricada:", error);
      }
    };

    // Modal Detalles de Prefabricada
    const manageDetails = prefabricada => {
      Object.assign(selectedPrefabricada, { ...prefabricada });
      showDetails.value = true;
    };

    const closeDetails = () => {
      showDetails.value = false;
      Object.assign(selectedPrefabricada, {
        id: null,
        nombre_prefabricada: "",
        m2: null,
        categoria_id: "",
        garantia: null,
        estilo_id: "",
        tipo_id: "",
        imagenes_prefabricadas: [],
        caracteristicas: [],
        precios: [],
      });
    };

    // Obtener nombre de la categoría
    const getCategoriaName = id => categorias.value.find(c => c.id === id)?.nombre_categoria || "Desconocida";

    // Lifecycle Hook
    onMounted(async () => {
      // Cargar datos al montar el componente
      await Promise.all([fetchPrefabricadas(), fetchCategorias(), fetchEstilos(), fetchTipos()]);
    });

    return {
      prefabricadas,
      categorias,
      estilos,
      tipos,
      filteredPrefabricadas,
      form,
      selectedPrefabricada,
      searchTerm,
      sortBy,
      showModal,
      showDetails,
      modalMode,
      openModal,
      closeModal,
      savePrefabricada,
      manageDetails,
      closeDetails,
      applyFilters,
      getCategoriaName,
      deletePrefabricada,
      deleteImage,
      deleteCaracteristica,
      deletePrecio,
      deleteIncluye,
      uploadImage,
      addCaracteristica,
      addPrecio,
      addIncluye
    };
  },
};
</script>


<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.table {
  transition: all 0.3s ease;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 0.5rem;
  pointer-events: none;
  transform: translate(0, 0);
  transition: transform 0.3s ease-out;
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: 500px;
    margin: 1.75rem auto;
  }
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}
</style>  