<script setup lang="ts">
function estrellas(calificacion: number) {
  return Array(5)
    .fill(0)
    .map((_, i) => i < Math.round(calificacion))
}
</script>

<template>
  <section class="ftco-section testimony-section bg-bottom" style="background-image: url(/images/bg_1.jpg);">
    <div class="overlay"></div>
    <div class="container">
      <div class="row justify-content-center pb-4">
        <div class="col-md-7 text-center heading-section heading-section-white ftco-animate">
          <span class="subheading">Testimonios</span>
          <h2 class="mb-4">Opiniones de nuestros turistas</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 mb-4">
          <div class="testimony-wrap py-4">
            <div class="text">
              <p class="star">
                <span v-for="(activa, i) in estrellas(5)" :key="i" class="fa" :class="activa ? 'fa-star' : 'fa-star-o'"></span>
              </p>
              <p class="mb-4">"Una experiencia inolvidable. El Salar de Uyuni es mágico y el equipo nos cuidó en todo momento."</p>
              <div class="d-flex align-items-center">
                <div class="user-img" style="background-image: url(/images/person_1.jpg)"></div>
                <div class="pl-3">
                  <p class="name">María López</p>
                  <span class="position">Tour Salar de Uyuni</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="testimony-wrap py-4">
            <div class="text">
              <p class="star">
                <span v-for="(activa, i) in estrellas(5)" :key="i" class="fa" :class="activa ? 'fa-star' : 'fa-star-o'"></span>
              </p>
              <p class="mb-4">"El guía fue excelente y la organización impecable. Recomiendo la aventura en la Amazonía."</p>
              <div class="d-flex align-items-center">
                <div class="user-img" style="background-image: url(/images/person_2.jpg)"></div>
                <div class="pl-3">
                  <p class="name">Carlos Pérez</p>
                  <span class="position">Aventura en la Amazonía</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="testimony-wrap py-4">
            <div class="text">
              <p class="star">
                <span v-for="(activa, i) in estrellas(4)" :key="i" class="fa" :class="activa ? 'fa-star' : 'fa-star-o'"></span>
              </p>
              <p class="mb-4">"Paisajes espectaculares y caminatas muy bien planificadas. Una experiencia única en Bolivia."</p>
              <div class="d-flex align-items-center">
                <div class="user-img" style="background-image: url(/images/person_3.jpg)"></div>
                <div class="pl-3">
                  <p class="name">Ana Gómez</p>
                  <span class="position">Camino del Inca</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="testimony-wrap py-4">
            <div class="text">
              <p class="star">
                <span v-for="(activa, i) in estrellas(5)" :key="i" class="fa" :class="activa ? 'fa-star' : 'fa-star-o'"></span>
              </p>
              <p class="mb-4">"Todo muy bien organizado, hoteles cómodos y la atención de primera. Sin duda volvería a viajar."</p>
              <div class="d-flex align-items-center">
                <div class="user-img" style="background-image: url(/images/person_4.jpg)"></div>
                <div class="pl-3">
                  <p class="name">Luis Rodríguez</p>
                  <span class="position">Ciudad Colonial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimony-section .row {
  display: flex;
  flex-wrap: wrap;
}

.testimony-section .row > [class*='col-'] {
  display: flex;
}

.testimony-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.testimony-wrap .text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.testimony-wrap .text .mb-4:last-of-type {
  flex: 1;
}
</style>
