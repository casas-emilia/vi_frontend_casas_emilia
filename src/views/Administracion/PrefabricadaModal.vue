<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">{{ prefabricada ? 'Editar' : 'Crear' }} Prefabricada</h3>
          <div class="mt-2 px-7 py-3">
            <form @submit.prevent="handleSubmit">
              <input v-model="form.nombre_prefabricada" placeholder="Nombre" class="mb-2 w-full p-2 border rounded" required />
              <input v-model.number="form.m2" type="number" placeholder="M2" class="mb-2 w-full p-2 border rounded" required />
              <input v-model="form.garantia" placeholder="Garantía" class="mb-2 w-full p-2 border rounded" required />
              <select v-model="form.categoria_id" class="mb-2 w-full p-2 border rounded" required>
                <option value="">Seleccione una categoría</option>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.nombre_categoria }}
                </option>
              </select>
              <select v-model="form.tipo_id" class="mb-2 w-full p-2 border rounded" required>
                <option value="">Seleccione un tipo</option>
                <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">
                  {{ tipo.material_estructura }}
                </option>
              </select>
              <select v-model="form.estilo_id" class="mb-2 w-full p-2 border rounded" required>
                <option value="">Seleccione un estilo</option>
                <option v-for="estilo in estilos" :key="estilo.id" :value="estilo.id">
                  {{ estilo.nombre_estilo }}
                </option>
              </select>
              <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps({
    prefabricada: Object,
    categorias: Array,
    tipos: Array,
    estilos: Array,
  });
  
  const emit = defineEmits(['close', 'save']);
  
  const form = ref({
    nombre_prefabricada: '',
    m2: 0,
    garantia: '',
    categoria_id: '',
    tipo_id: '',
    estilo_id: '',
  });
  
  watch(() => props.prefabricada, (newPrefabricada) => {
    if (newPrefabricada) {
      form.value = { ...newPrefabricada };
    } else {
      form.value = {
        nombre_prefabricada: '',
        m2: 0,
        garantia: '',
        categoria_id: '',
        tipo_id: '',
        estilo_id: '',
      };
    }
  }, { immediate: true });
  
  const handleSubmit = () => {
    emit('save', form.value);
  };
  </script>
  
  <style scoped>
  .table th, .table td {
    vertical-align: middle;
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1050;
  }
  
  .btn-close-white {
    background-color: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
  }
  
  .alert {
    font-size: 1rem;
  }
  </style>
  