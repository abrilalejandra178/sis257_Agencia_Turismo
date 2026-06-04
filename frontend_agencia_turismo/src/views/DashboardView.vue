<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import POSModule from '@/components/POSModule.vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (!authStore.token) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="dashboard">
    <POSModule />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1600px;
  margin: 0 auto;
}
</style>
