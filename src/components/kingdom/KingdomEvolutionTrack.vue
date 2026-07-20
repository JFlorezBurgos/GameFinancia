<script setup lang="ts">
import { computed } from 'vue'
import KingdomDiorama from '@/components/kingdom/KingdomDiorama.vue'
import { KINGDOM_STAGES, kingdomEngine } from '@/game/kingdom'
import type { KingdomSnapshot } from '@/types/kingdom.types'

interface Props {
  snapshot: KingdomSnapshot
}

const props = defineProps<Props>()

const stageSnapshots = computed(() =>
  KINGDOM_STAGES.map((stage) => ({
    stage,
    snap: kingdomEngine.buildSnapshotAtBalance(stage.previewBalance),
    active: props.snapshot.currentStage.id === stage.id,
  })),
)

function formatRange(min: number, max: number | null): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(n)

  if (max === null) return `${fmt(min)}+`
  return `${fmt(min)} – ${fmt(max)}`
}
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-sm font-semibold tracking-wide text-slate-300">
      Evolución de tu reino
    </h2>

    <div class="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <article
        v-for="item in stageSnapshots"
        :key="item.stage.id"
        class="w-[148px] shrink-0 space-y-2"
      >
        <div
          class="overflow-hidden rounded-xl border transition-all"
          :class="
            item.active
              ? 'border-amber-400/50 ring-1 ring-amber-400/30'
              : 'border-white/5 opacity-80'
          "
        >
          <KingdomDiorama :snapshot="item.snap" compact />
        </div>
        <div class="px-0.5">
          <p class="text-xs font-semibold text-slate-100">{{ item.stage.label }}</p>
          <p class="mt-0.5 text-[10px] text-slate-500">
            {{ formatRange(item.stage.minBalance, item.stage.maxBalance) }}
          </p>
          <p class="mt-1 text-[10px] leading-snug text-slate-400">
            {{ item.stage.caption }}
          </p>
        </div>
      </article>
    </div>

    <!-- Timeline -->
    <div class="relative mx-1 pt-2">
      <div class="absolute left-0 right-0 top-[11px] h-px bg-white/10" />
      <div class="relative flex justify-between">
        <div
          v-for="(item, index) in stageSnapshots"
          :key="item.stage.id"
          class="flex flex-col items-center gap-1"
        >
          <div
            class="h-2.5 w-2.5 rounded-full"
            :class="
              index === 0
                ? 'bg-amber-800'
                : index === 1
                  ? 'bg-emerald-500'
                  : index === 2
                    ? 'bg-sky-500'
                    : index === 3
                      ? 'bg-violet-500'
                      : index === 4
                        ? 'bg-blue-400'
                        : 'bg-amber-400'
            "
          />
          <span class="text-[9px] text-slate-600">
            {{ Math.round((index / (stageSnapshots.length - 1)) * 100) }}%
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
