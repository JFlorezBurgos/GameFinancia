<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppSplash from '@/components/app/AppSplash.vue'
import { useAppStore } from '@/stores/app.store'
import { useBudgetStore } from '@/stores/budget.store'
import { useFinanceStore } from '@/stores/finance.store'
import { useGoalsStore } from '@/stores/goals.store'
import { useMedalsStore } from '@/stores/medals.store'
import { usePlayerStore } from '@/stores/player.store'
import { useSettingsStore } from '@/stores/settings.store'
import { useGameEngine } from '@/composables/useGameEngine'

/** Duración mínima de la intro, para que se sienta como el arranque de una app nativa. */
const MIN_SPLASH_MS = 1500

const appStore = useAppStore()
const playerStore = usePlayerStore()
const financeStore = useFinanceStore()
const goalsStore = useGoalsStore()
const budgetStore = useBudgetStore()
const medalsStore = useMedalsStore()
const settingsStore = useSettingsStore()
const { syncAchievements } = useGameEngine()
const { error } = storeToRefs(appStore)

const isBooting = ref(true)

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

onMounted(async () => {
  const minSplashElapsed = wait(MIN_SPLASH_MS)

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

  await minSplashElapsed
  isBooting.value = false
})
</script>

<template>
  <div v-if="error" class="flex min-h-dvh items-center justify-center p-6 text-center">
    <div>
      <p class="text-4xl">⚠️</p>
      <p class="mt-3 font-semibold text-coral-400">{{ error }}</p>
    </div>
  </div>
  <RouterView v-else />

  <Transition name="splash-fade">
    <AppSplash v-if="isBooting && !error" />
  </Transition>
</template>

<style scoped>
.splash-fade-leave-active {
  transition: opacity 0.5s ease;
}
.splash-fade-leave-to {
  opacity: 0;
}
</style>
