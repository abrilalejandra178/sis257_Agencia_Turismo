<script setup lang="ts">
import type { Usuario } from '@/models/usuario'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'usuarios'
const props = defineProps({
  mostrar: Boolean,
  usuario: {
    type: Object as () => Usuario,
    default: () => ({}) as Usuario,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const usuario = ref<Usuario>({ ...props.usuario })
watch(
  () => props.usuario,
  (newVal) => {
    usuario.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: usuario.value.nombre,
      apellido: usuario.value.apellido,
      email: usuario.value.email,
      contraseña: usuario.value.contraseña,
      país: usuario.value.país,
      teléfono: usuario.value.teléfono,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${usuario.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    usuario.value = {} as Usuario
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Usuario'"
      style="width: 28rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText id="nombre" v-model="usuario.nombre" class="flex-auto" maxlength="50" autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="apellido" class="font-semibold w-3">Apellido</label>
        <InputText id="apellido" v-model="usuario.apellido" class="flex-auto" maxlength="50" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-3">Email</label>
        <InputText id="email" v-model="usuario.email" class="flex-auto" type="email" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="contraseña" class="font-semibold w-3">Contraseña</label>
        <InputText id="contraseña" v-model="usuario.contraseña" class="flex-auto" type="password" maxlength="10" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="país" class="font-semibold w-3">País</label>
        <InputText id="país" v-model="usuario.país" class="flex-auto" maxlength="20" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="teléfono" class="font-semibold w-3">Teléfono</label>
        <InputText id="teléfono" v-model="usuario.teléfono" class="flex-auto" maxlength="8" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false" />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>