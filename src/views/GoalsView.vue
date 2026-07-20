<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ContributeGoalForm from '@/components/finance/ContributeGoalForm.vue'
import GoalCard from '@/components/finance/GoalCard.vue'
import GoalForm from '@/components/finance/GoalForm.vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import { useGameEngine } from '@/composables/useGameEngine'
import { useGoalsStore } from '@/stores/goals.store'
import type { CreateGoalInput, SavingsGoal, UpdateGoalInput } from '@/types'

const goalsStore = useGoalsStore()
const { rewardGoalCompleted, notifyActivity } = useGameEngine()
const { sortedGoals, totalSaved, totalTargets, isLoading, activeGoals, completedGoals } =
  storeToRefs(goalsStore)

const { money } = useFinanceFormat()

const formOpen = ref(false)
const contributeOpen = ref(false)
const editingGoal = ref<SavingsGoal | null>(null)
const contributingGoal = ref<SavingsGoal | null>(null)

const overallPercent = computed(() => {
  if (totalTargets.value <= 0) return 0
  return Math.min(100, Math.round((totalSaved.value / totalTargets.value) * 100))
})

function openCreate(): void {
  editingGoal.value = null
  formOpen.value = true
}

function openEdit(goal: SavingsGoal): void {
  editingGoal.value = goal
  formOpen.value = true
}

function openContribute(goal: SavingsGoal): void {
  contributingGoal.value = goal
  contributeOpen.value = true
}

function closeForm(): void {
  formOpen.value = false
  editingGoal.value = null
}

function closeContribute(): void {
  contributeOpen.value = false
  contributingGoal.value = null
}

async function handleGoalSubmit(input: CreateGoalInput | UpdateGoalInput): Promise<void> {
  try {
    if (editingGoal.value) {
      await goalsStore.updateGoal(editingGoal.value.id, input as UpdateGoalInput)
      await notifyActivity()
    } else {
      const result = await goalsStore.createGoal(input as CreateGoalInput)
      if (result.justCompleted) {
        await rewardGoalCompleted()
      } else {
        await notifyActivity()
      }
    }
    closeForm()
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo guardar la meta')
  }
}

async function handleContribute(amount: number): Promise<void> {
  if (!contributingGoal.value) return

  try {
    const result = await goalsStore.contributeToGoal(contributingGoal.value.id, { amount })
    closeContribute()
    if (result.justCompleted) {
      await rewardGoalCompleted()
    } else {
      await notifyActivity()
    }
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo aportar')
  }
}

async function handleDelete(id: string): Promise<void> {
  if (!window.confirm('¿Eliminar esta meta?')) return
  await goalsStore.deleteGoal(id)
}
</script>

<template>
  <div class="space-y-5">
    <AppHeader
      title="Metas de Ahorro"
      subtitle="Define objetivos y sigue tu avance."
    />

    <AppCard v-if="sortedGoals.length > 0" padding="md">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-widest text-slate-500">Tesoro acumulado</p>
          <p class="mt-1 text-xl font-bold text-gradient-gold">{{ money(totalSaved) }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-slate-500">{{ overallPercent }}% del objetivo</p>
          <p class="mt-1 text-sm text-slate-300">
            {{ activeGoals.length }} activas · {{ completedGoals.length }} hechas
          </p>
        </div>
      </div>
    </AppCard>

    <AppButton variant="primary" block @click="openCreate">+ Nueva meta</AppButton>

    <div v-if="isLoading" class="py-8 text-center text-sm text-slate-500">
      Cargando metas...
    </div>

    <AppCard v-else-if="sortedGoals.length === 0" padding="lg" class="text-center">
      <p class="text-4xl">🎯</p>
      <p class="mt-3 font-semibold text-slate-200">Aún no tienes metas</p>
      <p class="mt-1 text-sm text-slate-400">
        Define un objetivo y observa cómo crece tu ciudad.
      </p>
    </AppCard>

    <section v-else class="space-y-3">
      <GoalCard
        v-for="goal in sortedGoals"
        :key="goal.id"
        :goal="goal"
        @contribute="openContribute"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </section>

    <GoalForm
      :open="formOpen"
      :goal="editingGoal"
      @close="closeForm"
      @submit="handleGoalSubmit"
    />

    <ContributeGoalForm
      :open="contributeOpen"
      :goal="contributingGoal"
      @close="closeContribute"
      @submit="handleContribute"
    />
  </div>
</template>
