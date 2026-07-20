<script setup lang="ts">
import { computed } from 'vue'
import { resolveCityAssetUrl } from '@/game'
import type { CityGridPosition } from '@/types'

interface Props {
  assetKey: string
  grid: CityGridPosition
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  zIndex?: number
  dimmed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  size: 'md',
  zIndex: 1,
  dimmed: false,
})

/** Tile isométrico aproximado para layout CSS. */
const TILE_W = 72
const TILE_H = 36

const src = computed(() => resolveCityAssetUrl(props.assetKey))

const style = computed(() => {
  const x = (props.grid.col - props.grid.row) * (TILE_W / 2)
  const y = (props.grid.col + props.grid.row) * (TILE_H / 2)
  return {
    transform: `translate(${x}px, ${y}px)`,
    zIndex: props.zIndex,
  }
})

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'w-12'
  if (props.size === 'lg') return 'w-24'
  return 'w-16'
})
</script>

<template>
  <div
    class="city-sprite pointer-events-none absolute left-1/2 top-8 -translate-x-1/2"
    :style="style"
    :class="dimmed ? 'opacity-40' : 'opacity-100'"
  >
    <img
      :src="src"
      :alt="alt"
      class="select-none drop-shadow-md transition-all duration-500"
      :class="sizeClass"
      draggable="false"
    />
  </div>
</template>
