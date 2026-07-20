<script setup lang="ts">
import type { MedalRarity } from '@/types'

interface Props {
  rarity?: MedalRarity
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  rarity: 'common',
  size: 'md',
})

const rarityClasses: Record<MedalRarity, string> = {
  common: 'bg-rarity-common/15 text-rarity-common border-rarity-common/30',
  uncommon: 'bg-rarity-uncommon/15 text-rarity-uncommon border-rarity-uncommon/30',
  rare: 'bg-rarity-rare/15 text-rarity-rare border-rarity-rare/30',
  epic: 'bg-rarity-epic/15 text-rarity-epic border-rarity-epic/30',
  legendary: 'bg-rarity-legendary/15 text-rarity-legendary border-rarity-legendary/30',
  mythic: 'bg-rarity-mythic/15 text-rarity-mythic border-rarity-mythic/30',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border font-semibold uppercase tracking-wide"
    :class="[rarityClasses[props.rarity], sizeClasses[props.size]]"
  >
    <slot />
  </span>
</template>
