<script setup lang="ts">
import { computed } from 'vue'
import KingdomDiorama from '@/components/kingdom/KingdomDiorama.vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import { kingdomEngine } from '@/game/kingdom'
import type { KingdomSnapshot } from '@/types/kingdom.types'

interface Props {
  snapshot: KingdomSnapshot
}

const props = defineProps<Props>()
const { money } = useFinanceFormat()

const nextStagePreview = computed(() =>
  props.snapshot.nextStage
    ? kingdomEngine.buildSnapshotAtBalance(props.snapshot.nextStage.previewBalance)
    : null,
)
</script>

<template>
  <div class="rounded-2xl border border-white/5 bg-[#12141c]/80 p-4">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-widest text-slate-500">Tu progreso actual</p>
        <p class="mt-1 text-xl font-bold text-slate-50">{{ money(snapshot.netWorth) }}</p>
        <p v-if="snapshot.nextStage" class="mt-1 text-xs text-slate-400">
          de {{ money(snapshot.nextStage.minBalance) }} para llegar a
          {{ snapshot.nextStage.label }}
        </p>
        <p v-else class="mt-1 text-xs text-amber-400/80">Reino en su máximo desarrollo visual</p>
      </div>

      <div class="min-w-[140px] flex-1 sm:max-w-xs">
        <div class="flex items-end justify-between gap-2">
          <span class="text-2xl font-bold text-sky-400">
            {{ snapshot.progressToNextPercent.toFixed(1).replace('.', ',') }}%
          </span>
        </div>
        <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-white/5">
          <div
            class="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-400 transition-all duration-500"
            :style="{ width: `${snapshot.progressToNextPercent}%` }"
          />
        </div>
      </div>

      <div
        v-if="snapshot.nextStage && nextStagePreview"
        class="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-2"
      >
        <div class="w-16 shrink-0 overflow-hidden rounded-lg">
          <KingdomDiorama :snapshot="nextStagePreview" compact />
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Próximo hito: {{ snapshot.nextStage.label }}
          </p>
          <p class="mt-1 text-xs leading-snug text-slate-300">
            Alcanzar {{ money(snapshot.nextStage.minBalance) }} para desbloquear esta etapa.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
