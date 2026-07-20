<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppCard from '@/components/ui/AppCard.vue'
import { getTodayKey, getYesterdayKey } from '@/utils/format'
import { isStreakAtRisk } from '@/game'
import { usePlayerStore } from '@/stores/player.store'

const playerStore = usePlayerStore()
const { profile, isStreakActiveToday } = storeToRefs(playerStore)

const atRisk = computed(() =>
  isStreakAtRisk(profile.value.lastActivityDate, getTodayKey(), getYesterdayKey()),
)

const statusLabel = computed(() => {
  if (isStreakActiveToday.value) return 'Racha activa hoy'
  if (atRisk.value) return 'Registra algo hoy para no perderla'
  if (profile.value.currentStreak === 0) return 'Registra un movimiento para empezar'
  return 'La racha se reinició'
})
</script>

<template>
  <AppCard padding="md" class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-coral-500/10 via-transparent to-gold-500/5" />
    <div class="relative flex items-center gap-4">
      <div
        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-500/15 text-2xl ring-1 ring-coral-500/25"
        :class="atRisk && !isStreakActiveToday ? 'animate-pulse' : ''"
      >
        🔥
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-xs font-medium uppercase tracking-widest text-coral-400/80">
          Racha diaria
        </p>
        <p class="mt-0.5 text-2xl font-bold text-slate-50">
          {{ profile.currentStreak }}
          <span class="text-sm font-medium text-slate-400">días</span>
        </p>
        <p class="mt-1 text-xs text-slate-400">{{ statusLabel }}</p>
      </div>
      <div class="shrink-0 text-right">
        <p class="text-[10px] uppercase tracking-wide text-slate-500">Récord</p>
        <p class="text-sm font-bold text-gold-400">{{ profile.longestStreak }}</p>
      </div>
    </div>
  </AppCard>
</template>
