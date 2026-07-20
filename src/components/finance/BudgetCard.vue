<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import type { BudgetStatus } from '@/types'

interface Props {
  status: BudgetStatus
  monthLabel: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [limit: number]
  claim: []
}>()

const { money } = useFinanceFormat()
const formOpen = ref(false)
const limit = ref('')
const limitError = ref('')

const hasBudget = computed(() => Boolean(props.status.budget))

watch(formOpen, (open) => {
  if (open) {
    limit.value = props.status.budget ? String(props.status.budget.limit) : ''
    limitError.value = ''
  }
})

function openForm(): void {
  formOpen.value = true
}

function handleSave(): void {
  const parsed = Number(limit.value)
  if (!limit.value || Number.isNaN(parsed) || parsed <= 0) {
    limitError.value = 'Ingresa un límite válido'
    return
  }
  emit('save', parsed)
  formOpen.value = false
}
</script>

<template>
  <AppCard padding="md">
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-medium uppercase tracking-widest text-slate-500">
            Presupuesto · {{ monthLabel }}
          </p>
          <p class="mt-1 font-semibold text-slate-100">
            {{ hasBudget ? money(status.budget!.limit) : 'Sin límite' }}
          </p>
        </div>
        <AppButton size="sm" variant="ghost" @click="openForm">
          {{ hasBudget ? 'Editar' : 'Definir' }}
        </AppButton>
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
        Define un tope de gastos mensuales para mantener el control.
      </p>
    </div>
  </AppCard>

  <AppModal
    :open="formOpen"
    title="Presupuesto mensual"
    subtitle="Tu límite de gastos para este periodo."
    @close="formOpen = false"
  >
    <form class="space-y-5" @submit.prevent="handleSave">
      <AppInput
        v-model="limit"
        label="Límite de gastos"
        type="number"
        inputmode="decimal"
        placeholder="0"
        :min="0"
        :error="limitError"
      />
      <div class="flex gap-3">
        <AppButton type="button" variant="ghost" block @click="formOpen = false">
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" block>Guardar</AppButton>
      </div>
    </form>
  </AppModal>
</template>
