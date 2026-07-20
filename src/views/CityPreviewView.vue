<script setup lang="ts">
import { computed, ref } from 'vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import CityScene from '@/components/city/CityScene.vue'
import {
  CITY_STAGES,
  CITY_XP_FOR_FULL_PROGRESS,
  CITY_XP_PER_CURRENCY_UNIT,
  cityProgressEngine,
} from '@/game'
import { formatCurrency } from '@/utils/format'

const progress = ref(0)

const snapshot = computed(() => cityProgressEngine.buildSnapshotAtProgress(progress.value))

const estimatedBalance = computed(
  () => Math.round((progress.value / 100) * CITY_XP_FOR_FULL_PROGRESS) * CITY_XP_PER_CURRENCY_UNIT,
)

function jumpToStage(minProgress: number): void {
  progress.value = minProgress
}
</script>

<template>
  <div class="mx-auto min-h-dvh max-w-lg space-y-5 px-4 py-6 pb-10">
    <AppHeader
      title="Preview · Mi Ciudad"
      subtitle="Así crece y se encoge según tu balance (XP de ciudad)."
    />

    <AppCard padding="md" class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <AppBadge rarity="legendary">{{ snapshot.stage.label }}</AppBadge>
          <p class="mt-2 text-sm text-slate-400">{{ snapshot.stage.description }}</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-gradient-gold">{{ snapshot.progressPercent }}%</p>
          <p class="text-xs text-slate-500">{{ snapshot.cityXp }} XP ciudad</p>
        </div>
      </div>

      <label class="block space-y-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-400">
          Simular prosperidad
        </span>
        <input
          v-model.number="progress"
          type="range"
          min="0"
          max="100"
          step="1"
          class="w-full accent-gold-500"
        />
      </label>

      <p class="text-xs text-slate-500">
        Balance estimado:
        <span class="font-semibold text-slate-300">{{ formatCurrency(estimatedBalance) }}</span>
        · 1 XP ≈ {{ formatCurrency(CITY_XP_PER_CURRENCY_UNIT) }} de balance positivo
      </p>
    </AppCard>

    <CityScene :snapshot="snapshot" />

    <section class="space-y-2">
      <h2 class="px-1 text-sm font-semibold uppercase tracking-widest text-slate-400">
        Fases
      </h2>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          v-for="stage in CITY_STAGES"
          :key="stage.stage"
          type="button"
          class="rounded-xl border px-3 py-3 text-left transition-colors"
          :class="
            snapshot.stage.stage === stage.stage
              ? 'border-gold-500/40 bg-gold-500/10'
              : 'border-white/10 bg-realm-900/50 hover:border-white/20'
          "
          @click="jumpToStage(stage.minProgress)"
        >
          <p class="text-sm font-semibold text-slate-100">{{ stage.label }}</p>
          <p class="mt-1 text-[10px] text-slate-500">
            {{ stage.minProgress }}% · {{ stage.minCityXp }} XP
          </p>
        </button>
      </div>
    </section>

    <AppCard padding="md">
      <p class="text-sm font-semibold text-slate-200">Cómo funciona</p>
      <ul class="mt-3 space-y-2 text-xs text-slate-400">
        <li>• Mete ingresos → sube el balance → sube el XP de ciudad → aparecen edificios.</li>
        <li>• Saca/gasta más de lo que entra → baja el balance → baja el XP → la ciudad se encoge.</li>
        <li>• En 0% vuelves al <strong class="text-slate-300">Campo</strong>: solo hierba, rocas y troncos.</li>
        <li>• Edificios visibles ahora: {{ snapshot.buildings.length }}</li>
      </ul>
    </AppCard>

    <p class="text-center text-xs text-slate-600">
      Vista de demo · no afecta tus datos reales
    </p>
  </div>
</template>
