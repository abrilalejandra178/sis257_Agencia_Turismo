# Frontend (Vue 3) - AI Agent Instructions

## 🎯 Frontend Architecture

**Framework**: Vue 3 (Composition API)  
**Build Tool**: Vite  
**State Management**: Pinia  
**Routing**: vue-router  
**UI Components**: PrimeVue  
**Styling**: CSS modules / Tailwind (check project)  
**Testing**: Vitest  
**TypeScript**: Full type safety

## 📦 Project Structure

```
src/
├── App.vue                      # Root component
├── main.ts                      # Entry point
├── assets/                      # Static files (images, fonts)
├── components/                  # Reusable components (not pages)
│   ├── shared/                  # Global components
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   └── Sidebar.vue
│   └── {feature}/               # Feature-specific components
│       ├── PackageCard.vue
│       └── ReservationForm.vue
├── views/                       # Page components (routed)
│   ├── Home.vue                 # Landing page
│   ├── Login.vue                # Authentication
│   ├── Packages.vue             # Browse packages
│   ├── MyReservations.vue       # User reservations
│   └── Reviews.vue              # User reviews
├── router/                      # Routing config
│   └── index.ts                 # Route definitions
├── stores/                      # Pinia state management
│   ├── auth.ts                  # Auth store (user, token)
│   ├── packages.ts              # Package catalog
│   ├── reservations.ts          # User reservations
│   └── reviews.ts               # Reviews store
├── models/                      # TypeScript interfaces/types
│   ├── User.ts
│   ├── Package.ts
│   ├── Reservation.ts
│   └── Review.ts
├── helpers/                     # Utility functions
│   ├── api.ts                   # API client setup
│   ├── auth.ts                  # Auth helpers
│   └── format.ts                # Formatting utilities
└── plugins/                     # Vue plugins
    └── primevue.ts              # PrimeVue config
```

## 🎨 Component Pattern

Use **Composition API with `<script setup>`** (modern Vue 3 style):

```vue
<!-- src/components/PackageCard.vue -->
<template>
  <div class="package-card">
    <h3>{{ package.nombre }}</h3>
    <p>{{ package.descripcion }}</p>
    <p class="price">${{ package.precio }}</p>
    <button @click="goToDetails">Ver detalles</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Package } from '@/models/Package';

interface Props {
  package: Package;
}

const props = defineProps<Props>();
const router = useRouter();

const goToDetails = () => {
  router.push(`/packages/${props.package.id_paquete}`);
};
</script>

<style scoped>
.package-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}
</style>
```

✅ Always use `<script setup>` syntax  
✅ Always type Props and Emits with TypeScript  
✅ Use `scoped` styles to avoid conflicts  
✅ Import types with `type` keyword

## 🌐 View Pattern (Page Components)

Views are components that map to routes:

```vue
<!-- src/views/Packages.vue -->
<template>
  <div class="packages-page">
    <h1>Paquetes Turísticos</h1>
    <div class="filters">
      <input v-model="search" placeholder="Buscar..." />
    </div>
    <div class="package-list">
      <PackageCard 
        v-for="pkg in filteredPackages" 
        :key="pkg.id_paquete"
        :package="pkg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { usePackagesStore } from '@/stores/packages';
import PackageCard from '@/components/PackageCard.vue';

const packageStore = usePackagesStore();
const search = ref('');

onMounted(async () => {
  await packageStore.fetchPackages();
});

const filteredPackages = computed(() => {
  return packageStore.packages.filter(pkg =>
    pkg.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>
```

Key patterns:
- Import and use stores with `const store = usePackageStore()`
- Use `computed()` for derived state
- Use `ref()` for local component state
- Call `onMounted()` to fetch data on page load
- Return JSX/template directly (no render functions)

## 🏪 Pinia Store Pattern

Stores manage global state:

```typescript
// src/stores/packages.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Package } from '@/models/Package';
import { api } from '@/helpers/api';

export const usePackagesStore = defineStore('packages', () => {
  // State
  const packages = ref<Package[]>([]);
  const loading = ref(false);

  // Computed
  const count = computed(() => packages.value.length);

  // Actions
  const fetchPackages = async () => {
    loading.value = true;
    try {
      const response = await api.get('/packages');
      packages.value = response.data;
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      loading.value = false;
    }
  };

  const createPackage = async (data: CreatePackageDto) => {
    const response = await api.post('/packages', data);
    packages.value.push(response.data);
    return response.data;
  };

  return {
    packages,
    loading,
    count,
    fetchPackages,
    createPackage,
  };
});
```

✅ Use Composition API syntax for stores  
✅ Always type state, computed, and return values  
✅ Actions fetch from API and update state  
✅ Use try/catch for error handling

## 🔐 Authentication Store Pattern

Special store for user authentication:

```typescript
// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/models/User';
import { api } from '@/helpers/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref(localStorage.getItem('token') || null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    token.value = response.data.access_token;
    user.value = response.data.user;
    localStorage.setItem('token', token.value);
    return response.data;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };
});
```

**Token storage**: Always store JWT in `localStorage` with key `'token'`

## 🛣️ Router Pattern

Define routes in `src/router/index.ts`:

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/packages',
    component: () => import('@/views/Packages.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/my-reservations',
    component: () => import('@/views/MyReservations.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reviews',
    component: () => import('@/views/Reviews.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard for protected routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
```

Key patterns:
- **Lazy loading**: `component: () => import('@/views/Page.vue')`
- **Route meta**: Use `meta: { requiresAuth: true }` for protected routes
- **Route guards**: `beforeEach()` for global guards
- **Dynamic routes**: Use `:id` for parameterized routes

## 🔌 API Client Helper

Setup axios/fetch wrapper in `src/helpers/api.ts`:

```typescript
// src/helpers/api.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export { api };
```

**API URL**: Configure in `.env.local`:
```
VITE_API_URL=http://localhost:3000/api/v1
```

## 📝 TypeScript Models

Define data types in `src/models/`:

```typescript
// src/models/Package.ts
export interface Package {
  id_paquete: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  capacidad_maxima: number;
  incluye_hospedaje: boolean;
  incluye_alimentacion: boolean;
  destino: Destino;
  guia: GuiaTuristico;
  transporte: Transporte;
}

export interface CreatePackageDto {
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  capacidad_maxima: number;
  incluye_hospedaje: boolean;
  incluye_alimentacion: boolean;
  id_destino: number;
  id_guia: number;
  id_transporte: number;
}
```

✅ Always define TypeScript interfaces for API responses  
✅ Use separate DTOs for create/update operations

## 🧪 Testing Pattern

Use Vitest for unit and component tests:

```typescript
// src/components/PackageCard.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PackageCard from './PackageCard.vue';
import type { Package } from '@/models/Package';

describe('PackageCard', () => {
  it('renders package name', () => {
    const pkg: Package = {
      id_paquete: 1,
      nombre: 'Viaje a La Paz',
      descripcion: 'Visita turística',
      precio: 100,
      // ... other required fields
    };

    const wrapper = mount(PackageCard, {
      props: { package: pkg },
    });

    expect(wrapper.text()).toContain('Viaje a La Paz');
  });

  it('emits event on button click', async () => {
    // Test component interactions
  });
});
```

Run tests:
```bash
npm run test                    # Watch mode
npm run test:ui                 # UI mode
npm run test:coverage           # With coverage
```

## 🎯 Quick Task: Add New Page

1. **Create View** in `src/views/NewPage.vue` with Composition API
2. **Add Route** in `src/router/index.ts`:
   ```typescript
   {
     path: '/new-page',
     component: () => import('@/views/NewPage.vue'),
     meta: { requiresAuth: false },
   }
   ```
3. **Create Store** (if needed) in `src/stores/newFeature.ts`
4. **Add Components** in `src/components/` if reusable
5. **Write Tests** for critical logic
6. **Link Navigation** from other pages/navbar

## 🔑 Important Rules

| Rule | Example | Reason |
|------|---------|--------|
| **Always use `<script setup>`** | `<script setup lang="ts">` | Modern, cleaner syntax |
| **Type all Props/Emits** | `defineProps<Props>()` | Type safety |
| **Use computed for derived state** | `const filtered = computed(...)` | Reactivity |
| **Use ref for local state** | `const count = ref(0)` | Local component data |
| **Fetch in onMounted** | `onMounted(async () => {})` | Lifecycle management |
| **Store token in localStorage** | `localStorage.setItem('token', ...)` | Persistence |
| **Lazy load routes** | `component: () => import(...)` | Performance |
| **Type API responses** | `type: Package[]` | Data integrity |

## 📦 Running Commands

```bash
cd frontend_agencia_turismo

# Development
npm run dev                     # Dev server (http://localhost:5173)
npm run build                   # Production build
npm run preview                 # Preview production build

# Testing & Quality
npm run test                    # Vitest watch mode
npm run test:ui                 # UI test runner
npm run test:coverage           # Coverage report
npm run lint                    # ESLint check
npm run type-check              # TypeScript check

# Build
npm run build                   # Create dist/ folder
```

## 🔗 Key Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Vue app initialization |
| `src/App.vue` | Root component |
| `src/router/index.ts` | Route definitions |
| `src/stores/` | Pinia state stores |
| `vite.config.ts` | Build configuration |
| `.env.local` | Environment variables |

See [QUICK_AGENT_REFERENCE.md](/memories/repo/QUICK_AGENT_REFERENCE.md) for code templates.

---

**Frontend Development Ready** ✅
