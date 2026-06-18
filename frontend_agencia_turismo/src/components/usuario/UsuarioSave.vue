<script setup lang="ts">
import type { Usuario } from '@/models/usuario'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

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

const rolesUsuario = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Gerente', value: 'gerente' },
  { label: 'Vendedor', value: 'vendedor' },
  { label: 'Cajero', value: 'cajero' },
  { label: 'Contador', value: 'contador' },
  { label: 'Guía', value: 'guia' },
  { label: 'Cliente', value: 'cliente' },
]

const usuario = ref<Usuario>({ ...props.usuario })

watch(
  () => props.usuario,
  (newVal) => {
    usuario.value = { ...newVal }
  },
)

watch(
  () => props.mostrar,
  (nuevo) => {
    if (nuevo) {
      usuario.value = props.usuario?.id
        ? { ...props.usuario }
        : ({ rol: 'vendedor' } as Usuario)
    }
  },
)

async function handleSave() {
  try {
    const body: Partial<Usuario> = {
      usuario: usuario.value.usuario?.trim(),
      nombre: usuario.value.nombre?.trim(),
      apellido: usuario.value.apellido?.trim(),
      email: usuario.value.email?.trim(),
      país: usuario.value.país?.trim(),
      teléfono: usuario.value.teléfono?.trim(),
      rol: usuario.value.rol,
    }
    if (!props.modoEdicion || usuario.value.contraseña?.trim()) {
      body.contraseña = usuario.value.contraseña
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${usuario.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    usuario.value = {} as Usuario
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando usuario'))
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Usuario'"
      style="width: 36rem"
    >
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="usuario" class="block font-bold mb-2">Usuario *</label>
          <InputText
            id="usuario"
            v-model="usuario.usuario"
            class="w-full"
            maxlength="20"
            autofocus
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="rol" class="block font-bold mb-2">Rol *</label>
          <Select
            id="rol"
            v-model="usuario.rol"
            :options="rolesUsuario"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            placeholder="Seleccione"
          />
        </div>

        <div class="field col-12 md:col-6">
          <label for="nombre" class="block font-bold mb-2">Nombre *</label>
          <InputText id="nombre" v-model="usuario.nombre" class="w-full" maxlength="50" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="apellido" class="block font-bold mb-2">Apellido *</label>
          <InputText id="apellido" v-model="usuario.apellido" class="w-full" maxlength="50" />
        </div>

        <div class="field col-12 md:col-6">
          <label for="email" class="block font-bold mb-2">Email *</label>
          <InputText id="email" v-model="usuario.email" class="w-full" type="email" maxlength="50" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="contraseña" class="block font-bold mb-2">Contraseña *</label>
          <InputText
            id="contraseña"
            v-model="usuario.contraseña"
            class="w-full"
            type="password"
            maxlength="360"
            :placeholder="props.modoEdicion ? 'Sin cambios' : ''"
            :disabled="props.modoEdicion"
          />
        </div>

        <div class="field col-12 md:col-6">
          <label for="país" class="block font-bold mb-2">País</label>
          <InputText id="país" v-model="usuario.país" class="w-full" maxlength="20" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="teléfono" class="block font-bold mb-2">Teléfono</label>
          <InputText id="teléfono" v-model="usuario.teléfono" class="w-full" maxlength="8" />
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <button type="button" class="app-btn app-btn-secondary" @click="dialogVisible = false">
          <i class="pi pi-times"></i> Cancelar
        </button>
        <button type="button" class="app-btn app-btn-primary" @click="handleSave">
          <i class="pi pi-save"></i> Guardar
        </button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
