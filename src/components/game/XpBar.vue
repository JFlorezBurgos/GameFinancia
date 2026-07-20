<script setup lang="ts">
import AppProgressBar from '@/components/ui/AppProgressBar.vue'

interface Props {
  level: number
  title: string
  currentXp: number
  xpForNextLevel: number
  progressPercent: number
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-end justify-between gap-3">
      <div>
        <p class="text-xs font-medium uppercase tracking-widest text-gold-500/80">Nivel {{ level }}</p>
        <p class="text-sm font-semibold text-slate-100">{{ title }}</p>
      </div>
      <p class="text-xs text-slate-400">
        {{ currentXp }} / {{ xpForNextLevel }} XP
      </p>
    </div>
    <AppProgressBar
      :value="progressPercent"
      :max="100"
      color="gold"
    />
  </div>
</template>
