<script setup lang="ts">
import introHero from '@/assets/branding/intro-hero.jpg'

interface Props {
  /** Mensaje corto que se muestra bajo el logo mientras carga la app. */
  status?: string
}

withDefaults(defineProps<Props>(), {
  status: 'Preparando tu reino…',
})
</script>

<template>
  <div class="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-realm-950">
    <img
      :src="introHero"
      alt=""
      aria-hidden="true"
      class="splash-breathe absolute inset-0 h-full w-full select-none object-cover"
      draggable="false"
    />
    <div
      class="absolute inset-0 bg-gradient-to-b from-realm-950/40 via-realm-950/55 to-realm-950"
    />

    <div class="relative z-10 flex flex-1 flex-col items-center justify-end gap-6 px-8 pb-14 text-center">
      <div class="splash-rise space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gold-400/90">
          Bienvenido a tu
        </p>
        <h1 class="text-gradient-gold text-4xl font-bold tracking-tight">Reino Financiero</h1>
        <p class="text-sm text-slate-300">Convierte tu ahorro en un reino que crece contigo.</p>
      </div>

      <div class="flex items-center gap-2" role="status" :aria-label="status">
        <span class="splash-dot h-1.5 w-1.5 rounded-full bg-gold-400" style="animation-delay: 0ms" />
        <span class="splash-dot h-1.5 w-1.5 rounded-full bg-gold-400" style="animation-delay: 150ms" />
        <span class="splash-dot h-1.5 w-1.5 rounded-full bg-gold-400" style="animation-delay: 300ms" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash-breathe {
  animation: splash-breathe 6s ease-in-out infinite;
}

.splash-rise {
  animation: splash-rise 0.7s ease-out both;
}

.splash-dot {
  animation: splash-dot 1s ease-in-out infinite;
}

@keyframes splash-breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
}

@keyframes splash-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes splash-dot {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.85);
  }
  40% {
    opacity: 1;
    transform: scale(1.15);
  }
}
</style>
