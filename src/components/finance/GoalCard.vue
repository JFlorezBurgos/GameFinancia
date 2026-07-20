<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import { getGoalProgress } from '@/game'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import type { SavingsGoal } from '@/types'

interface Props {
  goal: SavingsGoal
}

const props = defineProps<Props>()

const emit = defineEmits<{
  contribute: [goal: SavingsGoal]
  edit: [goal: SavingsGoal]
  delete: [id: string]
}>()

const { money, date } = useFinanceFormat()
const progress = computed(() => getGoalProgress(props.goal))
</script>

<template>
  <AppCard padding="md" :class="progress.isCompleted ? 'ring-1 ring-gold-500/30' : ''">
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <p class="truncate font-semibold text-slate-100">{{ goal.name }}</p>
            <AppBadge v-if="progress.isCompleted" rarity="legendary" size="sm">
              Completada
            </AppBadge>
          </div>
          <p v-if="goal.deadline" class="mt-1 text-xs text-slate-500">
            Límite: {{ date(goal.deadline) }}
          </p>
        </div>
        <p class="shrink-0 text-sm font-bold text-gold-400">
          {{ progress.progressPercent }}%
        </p>
      </div>

      <AppProgressBar :value="progress.progressPercent" :max="100" color="gold" />

      <div class="flex items-center justify-between text-xs text-slate-400">
        <span>{{ money(goal.currentAmount) }}</span>
        <span>{{ money(goal.targetAmount) }}</span>
      </div>

      <div v-if="!progress.isCompleted" class="flex gap-2">
        <AppButton size="sm" variant="primary" class="flex-1" @click="emit('contribute', goal)">
          Aportar
        </AppButton>
        <AppButton size="sm" variant="ghost" @click="emit('edit', goal)">Editar</AppButton>
        <AppButton size="sm" variant="danger" @click="emit('delete', goal.id)">Borrar</AppButton>
      </div>

      <div v-else class="flex justify-end">
        <AppButton size="sm" variant="ghost" @click="emit('delete', goal.id)">
          Eliminar
        </AppButton>
      </div>
    </div>
  </AppCard>
</template>
