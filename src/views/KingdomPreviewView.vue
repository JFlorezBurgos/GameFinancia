<script setup lang="ts">
import { computed, ref } from 'vue'
import KingdomDiorama from '@/components/kingdom/KingdomDiorama.vue'
import KingdomEvolutionTrack from '@/components/kingdom/KingdomEvolutionTrack.vue'
import KingdomProgressPanel from '@/components/kingdom/KingdomProgressPanel.vue'
import KingdomStatsHeader from '@/components/kingdom/KingdomStatsHeader.vue'
import { KINGDOM_STAGES, kingdomEngine } from '@/game/kingdom'
import { formatCurrency } from '@/utils/format'

const netWorth = ref(0)

const snapshot = computed(() => kingdomEngine.buildSnapshotAtBalance(netWorth.value))

function jump(balance: number): void {
  netWorth.value = balance
}
</script>

<template>
  <div class="mx-auto min-h-dvh max-w-lg space-y-6 bg-[#0a0b10] px-4 py-6 pb-12">
    <KingdomStatsHeader :snapshot="snapshot" />

    <KingdomDiorama :snapshot="snapshot" />

    <div class="rounded-2xl border border-white/5 bg-[#12141c] p-4 space-y-3">
      <label class="block space-y-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">
          Simular patrimonio neto
        </span>
        <input
          v-model.number="netWorth"
          type="range"
          min="0"
          max="220000000"
          step="500000"
          class="w-full accent-sky-500"
        />
      </label>
      <p class="text-sm text-slate-300">
        {{ formatCurrency(netWorth) }}
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="stage in KINGDOM_STAGES"
          :key="stage.id"
          type="button"
          class="rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-slate-300 hover:border-sky-500/40 hover:text-sky-300"
          @click="jump(stage.previewBalance)"
        >
          {{ stage.label }}
        </button>
      </div>
    </div>

    <KingdomEvolutionTrack :snapshot="snapshot" />
    <KingdomProgressPanel :snapshot="snapshot" />

    <p class="text-center text-[11px] text-slate-600">
      Demo visual · no modifica tus datos · progreso solo por patrimonio neto
    </p>
  </div>
</template>
