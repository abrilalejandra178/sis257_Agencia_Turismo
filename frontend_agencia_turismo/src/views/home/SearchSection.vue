<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'buscar', termino: string): void
}>()

const termino = ref('')

watch(termino, (nuevo) => {
  emit('buscar', nuevo)
})
</script>

<template>
  <section class="ftco-section ftco-no-pb ftco-no-pt">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="ftco-search d-flex justify-content-center">
            <div class="row">
              <div class="col-md-12 nav-link-wrap">
                <div class="nav nav-pills text-center" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <a class="nav-link active mr-md-1" id="v-pills-1-tab" data-toggle="pill" href="#v-pills-1" role="tab" aria-controls="v-pills-1" aria-selected="true">Buscar Tour</a>
                </div>
              </div>
              <div class="col-md-12 tab-wrap">
                <div class="tab-content" id="v-pills-tabContent">
                  <div class="tab-pane fade show active" id="v-pills-1" role="tabpanel">
                    <div class="search-property-1">
                      <div class="row no-gutters">
                        <div class="col-md d-flex">
                          <div class="form-group p-4 border-0 w-100">
                            <label for="busqueda">Destino o tour</label>
                            <div class="form-field">
                              <div class="icon"><span class="fa fa-search"></span></div>
                              <input id="busqueda" v-model="termino" type="text" class="form-control" placeholder="Ej: Salar de Uyuni">
                            </div>
                          </div>
                        </div>
                        <div class="col-md d-flex">
                          <div class="form-group d-flex w-100 border-0">
                            <div class="form-field w-100 align-items-center d-flex">
                              <button class="align-self-stretch form-control btn btn-primary" @click.prevent>
                                Buscar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
