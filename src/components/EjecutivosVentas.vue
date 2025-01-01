<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const ejecutivosVentas = ref([]);
const loading = ref(false);
const defaultImage = "/img/placeholder.png"; // Ruta relativa a la carpeta public

const fetchData = async () => {
  loading.value = true;
  try {
    // Paso 1: Obtener usuarios de la empresa
    const usuariosRes = await axios.get(
      // "http://localhost:8080/empresas/1/usuarios/"
      "https://v1backendcasasamilia-production.up.railway.app/empresas/1/usuarios/"
    );
    const usuarios = usuariosRes.data.usuarios;

    // Paso 2: Obtener roles_usuarios del rol "ejecutivo_ventas"
    const rolesRes = await axios.get(
      // "http://localhost:8080/roles/4/roles_usuarios/"
      "https://v1backendcasasamilia-production.up.railway.app/roles/3/roles_usuarios/"
    );
    const rolesUsuarios = rolesRes.data.roles_usuarios;

    // Filtrar usuarios con el rol "ejecutivo_ventas"
    const ejecutivosIds = rolesUsuarios.map((ru) => ru.usuario_id);
    const ejecutivos = usuarios.filter((usuario) =>
      ejecutivosIds.includes(usuario.id)
    );

    // Paso 3: Agregar información de contacto para cada ejecutivo
    const ejecutivosConContactos = await Promise.all(
      ejecutivos.map(async (ejecutivo) => {
        const contactosRes = await axios.get(
          // `http://localhost:8080/empresas/1/usuarios/${ejecutivo.id}/contactos/`
          `https://v1backendcasasamilia-production.up.railway.app/empresas/1/usuarios/${ejecutivo.id}/contactos/`
        );
        const contacto = contactosRes.data.contactos[0]; // Suponiendo un solo contacto por usuario

        return {
          id: ejecutivo.id,
          nombre_usuario: `${ejecutivo.primer_nombre}`,
          apellido_usuario: `${ejecutivo.primer_apellido}`,
          celular_laboral: contacto?.celular_laboral || "N/A",
          email_laboral: contacto?.email_laboral || "N/A",
          image: ejecutivo.image || null, // Si no hay imagen, será null
        };
      })
    );

    ejecutivosVentas.value = ejecutivosConContactos;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<template>
  <section class="ejecutivos-section bg-pattern py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="section-title">¿Listo para hacer realidad tu sueño?</h2>
        <p class="lead text-muted">Nuestro equipo de expertos está listo para ayudarte en cada paso del camino.</p>
      </div>
      
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Cargando ejecutivos...</p>
      </div>
      
      <div v-else class="row g-4">
        <div v-for="usuario in ejecutivosVentas" :key="usuario.id" class="col-md-6 col-lg-4">
          <div class="usuario-card">
            <div class="usuario-image-container">
              <img
                :src="usuario.image && usuario.image.trim() ? usuario.image : defaultImage"
                :alt="`Imagen de ${usuario.nombre_usuario}`"
                class="usuario-image"
              />
            </div>
            <div class="usuario-info">
              <h3>{{ usuario.nombre_usuario }} {{ usuario.apellido_usuario }}</h3>
              <p><i class="fas fa-phone-alt"></i> {{ usuario.celular_laboral }}</p>
              <p><i class="fas fa-envelope"></i> {{ usuario.email_laboral }}</p>
              <a
                v-if="usuario.celular_laboral !== 'N/A'"
                :href="`https://wa.me/${usuario.celular_laboral.replace(/[^0-9]/g, '')}`"
                target="_blank"
                class="whatsapp-button"
              >
                <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
              </a>
            </div>
          </div>
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

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0056b3;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  border: 4px solid rgba(0, 86, 179, 0.1);
  border-left-color: #0056b3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.usuario-card {
  background: linear-gradient(135deg, #ffffff, #f0f8ff);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.usuario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.usuario-image-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 3px solid #0056b3;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.usuario-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.usuario-info {
  text-align: center;
}

.usuario-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  color: #0056b3;
}

.usuario-info p {
  margin: 0.2rem 0;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.usuario-info p i {
  margin-right: 0.5rem;
  color: #0056b3;
}

.whatsapp-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.7rem 1.2rem;
  background-color: #25d366;
  color: #fff;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.whatsapp-button:hover {
  background-color: #128C7E;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.whatsapp-button i {
  margin-right: 0.5rem;
}
</style>