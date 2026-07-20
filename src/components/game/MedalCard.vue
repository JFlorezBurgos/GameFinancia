<script setup lang="ts">
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { RARITY_LABELS } from '@/game'
import type { MedalDefinition, MedalRarity } from '@/types'

interface Props {
  medal: MedalDefinition & {
    unlocked: boolean
    unlockedAt?: number
  }
}

defineProps<Props>()

function rarityTone(rarity: MedalRarity, unlocked: boolean): string {
  if (!unlocked) return 'opacity-45 grayscale'
  if (rarity === 'legendary' || rarity === 'mythic') return 'ring-1 ring-gold-500/35'
  if (rarity === 'epic') return 'ring-1 ring-rarity-epic/30'
  return ''
}
</script>

<template>
  <AppCard padding="md" :class="rarityTone(medal.rarity, medal.unlocked)">
    <div class="flex items-start justify-between gap-2">
      <span class="text-2xl" :class="medal.unlocked ? '' : 'opacity-50'">
        {{ medal.unlocked ? medal.icon : '🔒' }}
      </span>
      <AppBadge :rarity="medal.rarity" size="sm">
        {{ RARITY_LABELS[medal.rarity] }}
      </AppBadge>
    </div>
    <p class="mt-2 font-semibold text-slate-200">{{ medal.name }}</p>
    <p class="mt-1 text-xs text-slate-500">{{ medal.description }}</p>
    <p v-if="medal.unlocked" class="mt-2 text-[10px] font-medium uppercase tracking-wide text-gold-500/80">
      Desbloqueada
    </p>
  </AppCard>
</template>
