import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  applyGoalContribution,
  calculateTotalGoalTargets,
  calculateTotalSavings,
  getGoalProgress,
  sortGoals,
} from '@/game'
import { DexieGoalRepository } from '@/services/repositories'
import type { ContributeGoalInput, CreateGoalInput, SavingsGoal, UpdateGoalInput } from '@/types'
import { createId } from '@/utils/id'

const repository = new DexieGoalRepository()

export const useGoalsStore = defineStore('goals', () => {
  const goals = ref<SavingsGoal[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sortedGoals = computed(() => sortGoals(goals.value))

  const activeGoals = computed(() =>
    sortedGoals.value.filter((goal) => !goal.completedAt),
  )

  const completedGoals = computed(() =>
    sortedGoals.value.filter((goal) => Boolean(goal.completedAt)),
  )

  const goalProgressList = computed(() => sortedGoals.value.map(getGoalProgress))

  const totalSaved = computed(() => calculateTotalSavings(goals.value))

  const totalTargets = computed(() => calculateTotalGoalTargets(goals.value))

  async function loadGoals(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      goals.value = await repository.getAll()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar metas'
    } finally {
      isLoading.value = false
    }
  }

  async function createGoal(input: CreateGoalInput): Promise<{ goal: SavingsGoal; justCompleted: boolean }> {
    const initialAmount = input.initialAmount ?? 0
    const targetAmount = input.targetAmount
    const justCompleted = initialAmount >= targetAmount

    const goal: SavingsGoal = {
      id: createId(),
      name: input.name.trim(),
      targetAmount,
      currentAmount: Math.min(initialAmount, targetAmount),
      deadline: input.deadline || undefined,
      completedAt: justCompleted ? Date.now() : undefined,
      createdAt: Date.now(),
    }

    await repository.save(goal)
    goals.value = sortGoals([goal, ...goals.value])
    return { goal, justCompleted }
  }

  async function updateGoal(id: string, input: UpdateGoalInput): Promise<SavingsGoal> {
    const existing = goals.value.find((goal) => goal.id === id)
    if (!existing) throw new Error('Meta no encontrada')

    const updated: SavingsGoal = {
      ...existing,
      name: input.name.trim(),
      targetAmount: input.targetAmount,
      deadline: input.deadline || undefined,
      currentAmount: Math.min(existing.currentAmount, input.targetAmount),
      completedAt:
        existing.currentAmount >= input.targetAmount
          ? (existing.completedAt ?? Date.now())
          : undefined,
    }

    await repository.save(updated)
    goals.value = sortGoals(goals.value.map((goal) => (goal.id === id ? updated : goal)))
    return updated
  }

  async function contributeToGoal(
    id: string,
    input: ContributeGoalInput,
  ): Promise<{ goal: SavingsGoal; justCompleted: boolean }> {
    const existing = goals.value.find((goal) => goal.id === id)
    if (!existing) throw new Error('Meta no encontrada')

    const result = applyGoalContribution(existing, input.amount)
    await repository.save(result.goal)
    goals.value = sortGoals(
      goals.value.map((goal) => (goal.id === id ? result.goal : goal)),
    )
    return result
  }

  async function deleteGoal(id: string): Promise<void> {
    await repository.delete(id)
    goals.value = goals.value.filter((goal) => goal.id !== id)
  }

  return {
    goals,
    isLoading,
    error,
    sortedGoals,
    activeGoals,
    completedGoals,
    goalProgressList,
    totalSaved,
    totalTargets,
    loadGoals,
    createGoal,
    updateGoal,
    contributeToGoal,
    deleteGoal,
  }
})
