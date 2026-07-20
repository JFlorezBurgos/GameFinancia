<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { name: 'Inicio', to: '/', icon: 'home' },
  { name: 'Mi Reino', to: '/ciudad', icon: 'kingdom' },
  { name: 'Movimientos', to: '/movimientos', icon: 'ledger' },
  { name: 'Metas', to: '/metas', icon: 'goals' },
  { name: 'Perfil', to: '/perfil', icon: 'profile' },
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <nav
    class="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-white/5 bg-[#0a0b10]/95 backdrop-blur-xl"
  >
    <ul class="mx-auto flex max-w-lg items-stretch justify-around px-1 py-2">
      <li v-for="tab in tabs" :key="tab.to" class="flex-1">
        <RouterLink
          :to="tab.to"
          class="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-all duration-200"
          :class="isActive(tab.to) ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'"
        >
          <svg
            v-if="tab.icon === 'home'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
          </svg>
          <svg
            v-else-if="tab.icon === 'kingdom'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path d="M4 20h16M6 20V10l3 2 3-4 3 4 3-2v10" />
            <path d="M12 4v4" />
          </svg>
          <svg
            v-else-if="tab.icon === 'ledger'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
          <svg
            v-else-if="tab.icon === 'goals'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
          <svg
            v-else
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 19a7 7 0 0 1 14 0" />
          </svg>
          <span>{{ tab.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
