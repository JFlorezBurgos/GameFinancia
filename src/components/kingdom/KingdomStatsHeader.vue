<script setup lang="ts">
import { computed } from 'vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import { KINGDOM_STAGES } from '@/game/kingdom'
import type { KingdomSnapshot } from '@/types/kingdom.types'

interface Props {
  snapshot: KingdomSnapshot
}

const props = defineProps<Props>()
const { money, percent } = useFinanceFormat()

const stageIndex = computed(
  () => KINGDOM_STAGES.findIndex((stage) => stage.id === props.snapshot.currentStage.id) + 1,
)
</script>

<template>
  <header class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <span
            class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400"
            aria-hidden="true"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M5 16 3 7l5 3 4-6 4 6 5-3-2 9H5Zm0 2h14v2H5v-2Z"
              />
            </svg>
          </span>
          <h1 class="text-xl font-bold tracking-tight text-slate-50">Mi Reino</h1>
        </div>
        <p class="mt-1 text-sm text-slate-400">Tu reino crece con cada ahorro</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div class="rounded-2xl border border-white/5 bg-[#12141c]/80 p-4">
        <p class="text-[10px] uppercase tracking-widest text-slate-500">Ahorros totales</p>
        <p class="mt-2 text-lg font-bold text-slate-50">{{ money(snapshot.netWorth) }}</p>
        <p
          v-if="snapshot.monthDeltaPercent !== null"
          class="mt-1 text-xs"
          :class="snapshot.monthDeltaPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'"
        >
          {{ snapshot.monthDeltaPercent >= 0 ? '+' : '' }}{{ percent(snapshot.monthDeltaPercent) }}
          este mes
        </p>
      </div>

      <div class="rounded-2xl border border-white/5 bg-[#12141c]/80 p-4">
        <p class="text-[10px] uppercase tracking-widest text-slate-500">Nivel actual</p>
        <p class="mt-2 text-lg font-bold text-slate-50">{{ snapshot.currentStage.label }}</p>
        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            class="h-full rounded-full bg-sky-500 transition-all"
            :style="{ width: `${snapshot.progressToNextPercent}%` }"
          />
        </div>
      </div>

      <div class="rounded-2xl border border-white/5 bg-[#12141c]/80 p-4">
        <p class="text-[10px] uppercase tracking-widest text-slate-500">Etapa</p>
        <p class="mt-2 text-lg font-bold text-slate-50">
          {{ stageIndex }}
          <span class="text-sm font-medium text-slate-500">/ {{ KINGDOM_STAGES.length }}</span>
        </p>
        <p class="mt-1 text-xs text-slate-500">del recorrido del reino</p>
      </div>
    </div>
  </header>
</template>
