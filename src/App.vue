<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.store'
import { useBudgetStore } from '@/stores/budget.store'
import { useFinanceStore } from '@/stores/finance.store'
import { useGoalsStore } from '@/stores/goals.store'
import { useMedalsStore } from '@/stores/medals.store'
import { usePlayerStore } from '@/stores/player.store'
import { useSettingsStore } from '@/stores/settings.store'
import { useGameEngine } from '@/composables/useGameEngine'

const appStore = useAppStore()
const playerStore = usePlayerStore()
const financeStore = useFinanceStore()
const goalsStore = useGoalsStore()
const budgetStore = useBudgetStore()
const medalsStore = useMedalsStore()
const settingsStore = useSettingsStore()
const { syncAchievements } = useGameEngine()
const { isLoading, error } = storeToRefs(appStore)

onMounted(async () => {
  await appStore.bootstrap()
  await Promise.all([
    playerStore.loadProfile(),
    settingsStore.loadSettings(),
    financeStore.loadTransactions(),
    goalsStore.loadGoals(),
    budgetStore.loadBudgets(),
    medalsStore.loadMedals(),
  ])
  await syncAchievements()
})
</script>

<template>
  <div v-if="isLoading" class="flex min-h-dvh items-center justify-center">
    <div class="text-center">
      <p class="animate-pulse text-4xl">⚔️</p>
      <p class="mt-3 text-sm text-slate-400">Preparando tu reino...</p>
    </div>
  </div>

  <div v-else-if="error" class="flex min-h-dvh items-center justify-center p-6 text-center">
    <div>
      <p class="text-4xl">⚠️</p>
      <p class="mt-3 font-semibold text-coral-400">{{ error }}</p>
    </div>
  </div>

  <RouterView v-else />
</template>
