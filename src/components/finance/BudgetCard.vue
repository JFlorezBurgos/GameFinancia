<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import {
  BUDGET_CATEGORIES,
  buildDefaultBudgetCategories,
  getBudgetCategoryIcon,
  getBudgetCategoryLabel,
} from '@/game'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import type { BudgetCategoryLimit, BudgetStatus } from '@/types'

interface Props {
  status: BudgetStatus
  monthLabel: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [categories: BudgetCategoryLimit[]]
  delete: []
  claim: []
}>()

const { money } = useFinanceFormat()
const formOpen = ref(false)
const categoryLimits = ref<Record<string, string>>({})
const formError = ref('')

const hasBudget = computed(() => Boolean(props.status.budget))

const totalDraftLimit = computed(() =>
  BUDGET_CATEGORIES.reduce((sum, category) => {
    const value = Number(categoryLimits.value[category.id] ?? 0)
    return sum + (Number.isNaN(value) ? 0 : Math.max(0, value))
  }, 0),
)

watch(formOpen, (open) => {
  if (!open) return

  const defaults = buildDefaultBudgetCategories(props.status.budget?.limit ?? 0)
  const existing = props.status.budget?.categories?.length
    ? props.status.budget.categories
    : defaults

  const next: Record<string, string> = {}
  for (const category of BUDGET_CATEGORIES) {
    const found = existing.find((item) => item.categoryId === category.id)
    next[category.id] = found ? String(found.limit) : '0'
  }
  categoryLimits.value = next
  formError.value = ''
})

function openForm(): void {
  formOpen.value = true
}

function handleSave(): void {
  formError.value = ''
  const categories: BudgetCategoryLimit[] = BUDGET_CATEGORIES.map((category) => ({
    categoryId: category.id,
    limit: Math.max(0, Number(categoryLimits.value[category.id] || 0) || 0),
  }))

  if (categories.every((category) => category.limit <= 0)) {
    formError.value = 'Define al menos un límite mayor a 0'
    return
  }

  emit('save', categories)
  formOpen.value = false
}

function handleDelete(): void {
  if (!window.confirm('¿Eliminar el presupuesto de este mes?')) return
  emit('delete')
}
</script>

<template>
  <AppCard padding="md">
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-medium uppercase tracking-widest text-slate-500">
            Auxilio · {{ monthLabel }}
          </p>
          <p class="mt-1 font-semibold text-slate-100">
            {{ hasBudget ? money(status.budget!.limit) : 'Sin límite' }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            Topes de lo que te queda después de fijos y metas.
          </p>
        </div>
        <div class="flex shrink-0 gap-2">
          <AppButton size="sm" variant="ghost" @click="openForm">
            {{ hasBudget ? 'Editar' : 'Definir' }}
          </AppButton>
          <AppButton
            v-if="hasBudget"
            size="sm"
            variant="danger"
            @click="handleDelete"
          >
            Eliminar
          </AppButton>
        </div>
      </div>

      <template v-if="hasBudget">
        <AppProgressBar
          :value="status.progressPercent"
          :max="100"
          :label="`Gastado ${money(status.spent)}`"
          :color="status.isOverBudget ? 'coral' : 'emerald'"
        />

        <div class="flex items-center justify-between text-xs">
          <span :class="status.isOverBudget ? 'text-coral-400' : 'text-emerald-400'">
            {{
              status.isOverBudget
                ? `Excedido ${money(Math.abs(status.remaining))}`
                : `Quedan ${money(status.remaining)}`
            }}
          </span>
          <span
            v-if="status.budget?.rewardClaimedAt"
            class="font-medium text-emerald-400"
          >
            Cumplido
          </span>
        </div>

        <div class="space-y-2 border-t border-white/5 pt-3">
          <p class="text-[10px] font-medium uppercase tracking-widest text-slate-500">
            Por categoría
          </p>
          <div
            v-for="category in status.categories"
            :key="category.categoryId"
            class="space-y-1"
          >
            <div class="flex items-center justify-between gap-2 text-xs">
              <span class="truncate text-slate-300">
                {{ getBudgetCategoryIcon(category.categoryId) }}
                {{ getBudgetCategoryLabel(category.categoryId) }}
              </span>
              <span class="shrink-0 tabular-nums text-slate-400">
                {{ money(category.spent) }} / {{ money(category.limit) }}
              </span>
            </div>
            <AppProgressBar
              :value="category.progressPercent"
              :max="100"
              :color="category.isOverBudget ? 'coral' : 'gold'"
            />
          </div>
        </div>

        <AppButton
          v-if="status.canClaimReward"
          variant="primary"
          size="sm"
          block
          @click="emit('claim')"
        >
          Marcar presupuesto cumplido
        </AppButton>

        <p
          v-else-if="status.isOverBudget"
          class="text-center text-xs text-coral-400"
        >
          Estás por encima del límite este mes.
        </p>
      </template>

      <p v-else class="text-sm text-slate-400">
        Define topes para tu auxilio: personal, comida, mascota y variables.
      </p>
    </div>
  </AppCard>

  <AppModal
    :open="formOpen"
    title="Presupuesto del auxilio"
    subtitle="Estipula cómo repartir lo disponible del mes. Los fijos se gestionan aparte."
    @close="formOpen = false"
  >
    <form class="space-y-4" @submit.prevent="handleSave">
      <div
        v-for="category in BUDGET_CATEGORIES"
        :key="category.id"
        class="space-y-1"
      >
        <AppInput
          v-model="categoryLimits[category.id]"
          :label="`${category.icon} ${category.label}`"
          type="number"
          inputmode="decimal"
          placeholder="0"
          :min="0"
        />
      </div>

      <p class="text-sm text-slate-400">
        Total del auxilio:
        <span class="font-semibold text-slate-200">{{ money(totalDraftLimit) }}</span>
      </p>
      <p v-if="formError" class="text-xs text-coral-400">{{ formError }}</p>

      <div class="flex gap-3 pt-1">
        <AppButton type="button" variant="ghost" block @click="formOpen = false">
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" block>Guardar</AppButton>
      </div>
    </form>
  </AppModal>
</template>
