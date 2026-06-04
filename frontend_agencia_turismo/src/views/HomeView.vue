<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(() => {
    if ((window as any).AOS) (window as any).AOS.init({ duration: 800 })
    if ((window as any).$ && (window as any).$.fn.owlCarousel) {
      ;(window as any).$('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: { 0: { items: 1 }, 600: { items: 3 }, 1000: { items: 4 } },
      })
    }
    if ((window as any).$ && (window as any).$.fn.waypoint) {
      ;(window as any).$('.number').each(function (this: any) {
        const $this = (window as any).$(this)
        $this.waypoint(
          function () {
            $this.animateNumber({ number: $this.data('number') }, 4000)
          },
          { offset: '95%' },
        )
      })
    }
  }, 500)
})
</script>

<template>
  <div>
    <!-- Hero -->
    <div
      style="
        width: 100vw;
        min-height: 100vh;
        background-image: url('/images/bg_1.jpg');
        background-size: cover;
        background-position: center;
        position: relative;
        margin-left: calc(-50vw + 50%);
      "
    >
      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        "
      ></div>
      <div
        style="
          position: relative;
          z-index: 2;
          padding-top: 200px;
          padding-left: 5%;
          padding-bottom: 50px;
        "
      >
        <h1
          style="
            color: white;
            font-size: 3.5rem;
            font-weight: 700;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
          "
        >
          <strong>Explora <br /></strong> tu ciudad increíble
        </h1>
        <p style="color: white; font-size: 1.2rem; margin-top: 1rem">
          Encuentra los mejores lugares para quedarte, comer, comprar o visitar
        </p>
      </div>
    </div>

    <!-- Servicios -->
    <section class="ftco-section services-section bg-light">
      <div class="container">
        <div class="row d-flex">
          <div class="col-md-3 d-flex align-self-stretch ftco-animate">
            <div class="media block-6 services d-block text-center">
              <div class="d-flex justify-content-center">
                <div class="icon"><span class="flaticon-guarantee"></span></div>
              </div>
              <div class="media-body p-2 mt-2">
                <h3 class="heading mb-3">Mejor Precio Garantizado</h3>
                <p>Garantizamos los mejores precios del mercado.</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 d-flex align-self-stretch ftco-animate">
            <div class="media block-6 services d-block text-center">
              <div class="d-flex justify-content-center">
                <div class="icon"><span class="flaticon-like"></span></div>
              </div>
              <div class="media-body p-2 mt-2">
                <h3 class="heading mb-3">Los Viajeros nos Aman</h3>
                <p>Miles de viajeros confían en nosotros.</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 d-flex align-self-stretch ftco-animate">
            <div class="media block-6 services d-block text-center">
              <div class="d-flex justify-content-center">
                <div class="icon"><span class="flaticon-detective"></span></div>
              </div>
              <div class="media-body p-2 mt-2">
                <h3 class="heading mb-3">Mejor Agente de Viajes</h3>
                <p>Nuestros agentes tienen años de experiencia.</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 d-flex align-self-stretch ftco-animate">
            <div class="media block-6 services d-block text-center">
              <div class="d-flex justify-content-center">
                <div class="icon"><span class="flaticon-support"></span></div>
              </div>
              <div class="media-body p-2 mt-2">
                <h3 class="heading mb-3">Soporte Dedicado</h3>
                <p>Estamos disponibles 24/7 para ayudarte.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Paquetes -->
    <section class="ftco-section bg-light">
      <div class="container">
        <div class="row justify-content-start mb-5 pb-3">
          <div class="col-md-7 heading-section ftco-animate">
            <span class="subheading">Ofertas Especiales</span>
            <h2 class="mb-4"><strong>Top</strong> Paquetes Turísticos</h2>
          </div>
        </div>
      </div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm col-md-6 col-lg ftco-animate">
            <div class="destination">
              <a
                href="#"
                class="img img-2 d-flex justify-content-center align-items-center"
                style="background-image: url(/images/destination-1.jpg)"
              >
                <div class="icon d-flex justify-content-center align-items-center">
                  <span class="icon-search2"></span>
                </div>
              </a>
              <div class="text p-3">
                <div class="d-flex">
                  <div class="one">
                    <h3><a href="#">Bolivia, Salar</a></h3>
                    <p class="rate">
                      <i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i
                      ><i class="icon-star"></i><i class="icon-star-o"></i><span>8 Rating</span>
                    </p>
                  </div>
                  <div class="two"><span class="price">$200</span></div>
                </div>
                <p>Explora los lugares más increíbles de Bolivia.</p>
                <p class="days"><span>2 días 3 noches</span></p>
                <hr />
                <p class="bottom-area d-flex">
                  <span><i class="icon-map-o"></i> Uyuni, Bolivia</span>
                  <span class="ml-auto"><a href="#">Descubrir</a></span>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm col-md-6 col-lg ftco-animate">
            <div class="destination">
              <a
                href="#"
                class="img img-2 d-flex justify-content-center align-items-center"
                style="background-image: url(/images/destination-2.jpg)"
              >
                <div class="icon d-flex justify-content-center align-items-center">
                  <span class="icon-search2"></span>
                </div>
              </a>
              <div class="text p-3">
                <div class="d-flex">
                  <div class="one">
                    <h3><a href="#">Lago Titicaca</a></h3>
                    <p class="rate">
                      <i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i
                      ><i class="icon-star"></i><i class="icon-star-o"></i><span>9 Rating</span>
                    </p>
                  </div>
                  <div class="two"><span class="price">$150</span></div>
                </div>
                <p>El lago navegable más alto del mundo.</p>
                <p class="days"><span>3 días 4 noches</span></p>
                <hr />
                <p class="bottom-area d-flex">
                  <span><i class="icon-map-o"></i> La Paz, Bolivia</span>
                  <span class="ml-auto"><a href="#">Descubrir</a></span>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm col-md-6 col-lg ftco-animate">
            <div class="destination">
              <a
                href="#"
                class="img img-2 d-flex justify-content-center align-items-center"
                style="background-image: url(/images/destination-3.jpg)"
              >
                <div class="icon d-flex justify-content-center align-items-center">
                  <span class="icon-search2"></span>
                </div>
              </a>
              <div class="text p-3">
                <div class="d-flex">
                  <div class="one">
                    <h3><a href="#">Misiones Jesuíticas</a></h3>
                    <p class="rate">
                      <i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i
                      ><i class="icon-star"></i><i class="icon-star-o"></i><span>8 Rating</span>
                    </p>
                  </div>
                  <div class="two"><span class="price">$180</span></div>
                </div>
                <p>Patrimonio cultural declarado por la UNESCO.</p>
                <p class="days"><span>2 días 2 noches</span></p>
                <hr />
                <p class="bottom-area d-flex">
                  <span><i class="icon-map-o"></i> Santa Cruz, Bolivia</span>
                  <span class="ml-auto"><a href="#">Descubrir</a></span>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm col-md-6 col-lg ftco-animate">
            <div class="destination">
              <a
                href="#"
                class="img img-2 d-flex justify-content-center align-items-center"
                style="background-image: url(/images/destination-4.jpg)"
              >
                <div class="icon d-flex justify-content-center align-items-center">
                  <span class="icon-search2"></span>
                </div>
              </a>
              <div class="text p-3">
                <div class="d-flex">
                  <div class="one">
                    <h3><a href="#">Madidi Nacional</a></h3>
                    <p class="rate">
                      <i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i
                      ><i class="icon-star"></i><i class="icon-star-o"></i><span>9 Rating</span>
                    </p>
                  </div>
                  <div class="two"><span class="price">$250</span></div>
                </div>
                <p>Gran diversidad de flora y fauna amazónica.</p>
                <p class="days"><span>4 días 5 noches</span></p>
                <hr />
                <p class="bottom-area d-flex">
                  <span><i class="icon-map-o"></i> Beni, Bolivia</span>
                  <span class="ml-auto"><a href="#">Descubrir</a></span>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm col-md-6 col-lg ftco-animate">
            <div class="destination">
              <a
                href="#"
                class="img img-2 d-flex justify-content-center align-items-center"
                style="background-image: url(/images/destination-5.jpg)"
              >
                <div class="icon d-flex justify-content-center align-items-center">
                  <span class="icon-search2"></span>
                </div>
              </a>
              <div class="text p-3">
                <div class="d-flex">
                  <div class="one">
                    <h3><a href="#">Sucre Colonial</a></h3>
                    <p class="rate">
                      <i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i
                      ><i class="icon-star"></i><i class="icon-star-o"></i><span>8 Rating</span>
                    </p>
                  </div>
                  <div class="two"><span class="price">$120</span></div>
                </div>
                <p>Ciudad histórica conocida por su arquitectura colonial.</p>
                <p class="days"><span>2 días 2 noches</span></p>
                <hr />
                <p class="bottom-area d-flex">
                  <span><i class="icon-map-o"></i> Sucre, Bolivia</span>
                  <span class="ml-auto"><a href="#">Descubrir</a></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contador -->
    <section
      class="ftco-section ftco-counter img"
      id="section-counter"
      style="background-image: url(/images/bg_1.jpg)"
    >
      <div class="container">
        <div class="row justify-content-center mb-5 pb-3">
          <div class="col-md-7 text-center heading-section heading-section-white ftco-animate">
            <h2 class="mb-4">Algunos datos interesantes</h2>
            <span class="subheading">Más de 10,000 viajeros satisfechos</span>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-10">
            <div class="row">
              <div class="col-md-3 d-flex justify-content-center counter-wrap ftco-animate">
                <div class="block-18 text-center">
                  <div class="text">
                    <strong class="number" data-number="10000">0</strong>
                    <span>Clientes Felices</span>
                  </div>
                </div>
              </div>
              <div class="col-md-3 d-flex justify-content-center counter-wrap ftco-animate">
                <div class="block-18 text-center">
                  <div class="text">
                    <strong class="number" data-number="50">0</strong>
                    <span>Destinos</span>
                  </div>
                </div>
              </div>
              <div class="col-md-3 d-flex justify-content-center counter-wrap ftco-animate">
                <div class="block-18 text-center">
                  <div class="text">
                    <strong class="number" data-number="100">0</strong>
                    <span>Hoteles</span>
                  </div>
                </div>
              </div>
              <div class="col-md-3 d-flex justify-content-center counter-wrap ftco-animate">
                <div class="block-18 text-center">
                  <div class="text">
                    <strong class="number" data-number="200">0</strong>
                    <span>Tours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="ftco-section-parallax">
      <div class="parallax-img d-flex align-items-center">
        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="col-md-7 text-center heading-section heading-section-white ftco-animate">
              <h2>Suscríbete a nuestro Newsletter</h2>
              <p>Recibe las mejores ofertas y promociones de viajes directamente en tu correo.</p>
              <div class="row d-flex justify-content-center mt-5">
                <div class="col-md-8">
                  <div class="subscribe-form">
                    <div class="form-group d-flex">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Ingresa tu correo electrónico"
                      />
                      <button class="submit px-3">Suscribirse</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="ftco-footer ftco-bg-dark ftco-section">
      <div class="container">
        <div class="row mb-5">
          <div class="col-md">
            <div class="ftco-footer-widget mb-4">
              <h2 class="ftco-heading-2">Agencia de Turismo</h2>
              <p>Tu mejor opción para explorar Bolivia y el mundo.</p>
              <ul class="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                <li class="ftco-animate">
                  <a href="#"><span class="icon-twitter"></span></a>
                </li>
                <li class="ftco-animate">
                  <a href="#"><span class="icon-facebook"></span></a>
                </li>
                <li class="ftco-animate">
                  <a href="#"><span class="icon-instagram"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md">
            <div class="ftco-footer-widget mb-4 ml-md-5">
              <h2 class="ftco-heading-2">Información</h2>
              <ul class="list-unstyled">
                <li><a href="#" class="py-2 d-block">Acerca de</a></li>
                <li><a href="#" class="py-2 d-block">Servicios</a></li>
                <li><a href="#" class="py-2 d-block">Términos y Condiciones</a></li>
                <li><a href="#" class="py-2 d-block">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div class="col-md">
            <div class="ftco-footer-widget mb-4">
              <h2 class="ftco-heading-2">Soporte al Cliente</h2>
              <ul class="list-unstyled">
                <li><a href="#" class="py-2 d-block">FAQ</a></li>
                <li><a href="#" class="py-2 d-block">Opciones de Pago</a></li>
                <li><a href="#" class="py-2 d-block">Tips de Viaje</a></li>
                <li><a href="#" class="py-2 d-block">Contáctanos</a></li>
              </ul>
            </div>
          </div>
          <div class="col-md">
            <div class="ftco-footer-widget mb-4">
              <h2 class="ftco-heading-2">¿Tienes preguntas?</h2>
              <div class="block-23 mb-3">
                <ul>
                  <li>
                    <span class="icon icon-map-marker"></span
                    ><span class="text">La Paz, Bolivia</span>
                  </li>
                  <li>
                    <a href="#"
                      ><span class="icon icon-phone"></span
                      ><span class="text">+591 2 123 4567</span></a
                    >
                  </li>
                  <li>
                    <a href="#"
                      ><span class="icon icon-envelope"></span
                      ><span class="text">info@agenciaturismo.com</span></a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 text-center">
            <p>Copyright &copy; 2026 Agencia de Turismo. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hero-wrap {
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.hero-wrap .container {
  position: relative;
  z-index: 1;
}

.js-fullheight {
  min-height: 100vh;
}

.slider-text {
  padding-top: 150px;
  padding-bottom: 50px;
}

.slider-text h1 {
  color: white;
  font-size: 3.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.slider-text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}
</style>
