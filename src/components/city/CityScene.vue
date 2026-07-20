<script setup lang="ts">
import { computed } from 'vue'
import CitySprite from '@/components/city/CitySprite.vue'
import type { CitySnapshot } from '@/types'

interface Props {
  snapshot: CitySnapshot
}

const props = defineProps<Props>()

const seasonTint = computed(() => {
  switch (props.snapshot.season) {
    case 'spring':
      return 'from-emerald-500/15 via-transparent to-gold-500/5'
    case 'summer':
      return 'from-gold-500/15 via-transparent to-emerald-500/5'
    case 'autumn':
      return 'from-orange-500/15 via-transparent to-coral-500/10'
    case 'winter':
      return 'from-slate-400/15 via-transparent to-realm-700/20'
    default:
      return 'from-gold-500/10 via-transparent to-emerald-500/5'
  }
})

const sortedBuildings = computed(() =>
  [...props.snapshot.buildings].sort(
    (a, b) => a.grid.col + a.grid.row - (b.grid.col + b.grid.row),
  ),
)

const sortedDecorations = computed(() =>
  [...props.snapshot.decorations].sort(
    (a, b) => a.grid.col + a.grid.row - (b.grid.col + b.grid.row),
  ),
)
</script>

<template>
  <!-- Escena observacional: sin botones ni hits sobre sprites -->
  <div
    class="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-realm-900/80"
    aria-hidden="true"
  >
    <div class="absolute inset-0 bg-gradient-to-b" :class="seasonTint" />

    <div
      class="pointer-events-none relative mx-auto h-[280px] w-full max-w-md select-none sm:h-[320px]"
    >
      <!-- Terreno de fondo -->
      <CitySprite
        v-for="tile in snapshot.terrain"
        :key="`terrain-${tile.id}`"
        :asset-key="tile.assetKey"
        :grid="tile.grid"
        size="lg"
        :z-index="1"
        dimmed
      />

      <CitySprite
        v-for="decoration in sortedDecorations"
        :key="`deco-${decoration.id}`"
        :asset-key="decoration.assetKey"
        :grid="decoration.grid"
        :alt="decoration.name"
        size="sm"
        :z-index="10 + decoration.grid.col + decoration.grid.row"
      />

      <CitySprite
        v-for="building in sortedBuildings"
        :key="`building-${building.id}`"
        :asset-key="building.assetKey"
        :grid="building.grid"
        :alt="building.name"
        size="md"
        :z-index="building.zIndex"
      />

      <div
        v-if="snapshot.buildings.length === 0"
        class="absolute inset-0 flex items-center justify-center"
      >
        <p class="text-sm text-slate-500">Tu ciudad aparecerá aquí</p>
      </div>
    </div>
  </div>
</template>
