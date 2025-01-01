<template>
  <section id="caracteristicas-ventajas" class="py-2 bg-pattern">
    <div class="container position-relative">
      <h2 class="text-center mb-5 section-title">
        ¿Por qué elegir nuestras casas?
      </h2>
      <div class="content-wrapper p-8">
        <div class="row g-4">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="col-md-4"
          >
            <div
              ref="featureCards"
              class="feature-card text-center"
              :class="{
                'animate__animated animate__fadeInUp': feature.isVisible,
              }"
              :style="{ animationDelay: feature.isVisible ? `${index * 0.2}s` : '' }"
            >
              <div :class="['icon-wrapper', feature.bgColor]">
                <i :class="feature.icon"></i>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container position-relative py-5">
      <h2 class="text-center mb-5 section-title">
        Ventajas de las Casas Prefabricadas
      </h2>
      <div class="content-wrapper p-8">
        <div class="row g-4">
          <div
            v-for="(advantage, index) in advantages"
            :key="advantage.title"
            class="col-md-6 col-lg-3"
          >
            <div
              ref="advantageCards"
              class="advantage-card text-center"
              :class="{
                'animate__animated animate__fadeInUp': advantage.isVisible,
              }"
              :style="{ animationDelay: advantage.isVisible ? `${index * 0.2}s` : '' }"
            >
              <div :class="['icon-wrapper', advantage.bgColor]">
                <i :class="advantage.icon"></i>
              </div>
              <h3>{{ advantage.title }}</h3>
              <p>{{ advantage.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import "animate.css";

// Datos
const features = ref([
  {
    title: "Rápida Construcción",
    description:
      "Nuestras casas se construyen en tiempo récord, ahorrándote tiempo y molestias.",
    icon: "fas fa-stopwatch",
    bgColor: "bg-primary",
    isVisible: false,
  },
  {
    title: "Eco-Friendly",
    description:
      "Utilizamos materiales sostenibles y procesos que respetan el medio ambiente.",
    icon: "fas fa-leaf",
    bgColor: "bg-success",
    isVisible: false,
  },
  {
    title: "Costo-Eficiente",
    description:
      "Obtén una casa de calidad a un precio más accesible que la construcción tradicional.",
    icon: "fas fa-piggy-bank",
    bgColor: "bg-warning",
    isVisible: false,
  },
]);

const advantages = ref([
  {
    title: "Construcción Rápida",
    description:
      "Reduce significativamente el tiempo de construcción comparado con métodos tradicionales.",
    icon: "fas fa-tachometer-alt",
    bgColor: "bg-info",
    isVisible: false,
  },
  {
    title: "Ahorro de Costos",
    description:
      "Precios más competitivos debido a la eficiencia en la producción y construcción.",
    icon: "fas fa-dollar-sign",
    bgColor: "bg-success",
    isVisible: false,
  },
  {
    title: "Sostenibilidad",
    description:
      "Menor impacto ambiental y uso más eficiente de los materiales de construcción.",
    icon: "fas fa-recycle",
    bgColor: "bg-primary",
    isVisible: false,
  },
  {
    title: "Calidad Controlada",
    description:
      "Fabricación en ambientes controlados que garantizan alta calidad y precisión.",
    icon: "fas fa-tools",
    bgColor: "bg-warning",
    isVisible: false,
  },
]);

// Intersection Observer
const observeVisibility = (cards, data) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cards.value.indexOf(entry.target);
          if (index !== -1) data.value[index].isVisible = true;
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.value.forEach((card) => observer.observe(card));
};

// Referencias y lógica
const featureCards = ref([]);
const advantageCards = ref([]);

onMounted(() => {
  watch(
    () => featureCards.value,
    () => observeVisibility(featureCards, features)
  );

  watch(
    () => advantageCards.value,
    () => observeVisibility(advantageCards, advantages)
  );
});
</script>

<style scoped>
:root {
  --primary-color: #31ca71;
  --secondary-color: #27ae60;
  --accent-color: #3498db;
  --text-color: #333333;
  --light-bg: #f8f9fa;
  --dark-bg: #343a40;
}

.bg-pattern {
  background-color: #f0f8ff;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239bc2e6' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0056b3;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.content-wrapper {
  padding: 2rem;
  border-radius: 15px;
}

.feature-card,
.advantage-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 30px;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.feature-card::before,
.advantage-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.2) 40%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0.2) 100%
  );
  transform: rotate(30deg);
  transition: all 0.5s ease;
  opacity: 0;
}

.feature-card:hover::before,
.advantage-card:hover::before {
  transform: rotate(0deg);
  opacity: 1;
}

.feature-card:hover,
.advantage-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.icon-wrapper i {
  font-size: 32px;
  color: #ffffff;
  transition: all 0.3s ease;
}

.feature-card:hover .icon-wrapper,
.advantage-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.feature-card:hover .icon-wrapper i,
.advantage-card:hover .icon-wrapper i {
  transform: scale(1.2);
}

.feature-card h3,
.advantage-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0056b3;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.feature-card:hover h3,
.advantage-card:hover h3 {
  color: #003d82;
}

.feature-card p,
.advantage-card p {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .feature-card,
  .advantage-card {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 2rem;
  }
}

/* Estilos específicos para los colores de fondo */
.bg-primary {
  background-color: #007bff;
}

.bg-success {
  background-color: #28a745;
}

.bg-warning {
  background-color: #ffc107;
}

.bg-info {
  background-color: #17a2b8;
}
</style>
