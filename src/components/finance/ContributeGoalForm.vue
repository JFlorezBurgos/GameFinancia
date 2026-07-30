<script setup lang="ts">
import { ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import type { SavingsGoal } from '@/types'

interface Props {
  open: boolean
  goal: SavingsGoal | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [amount: number]
}>()

const { money } = useFinanceFormat()
const amount = ref('')
const amountError = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      amount.value = ''
      amountError.value = ''
    }
  },
)

function handleSubmit(): void {
  const parsed = Number(amount.value)
  if (!amount.value || Number.isNaN(parsed) || parsed <= 0) {
    amountError.value = 'Ingresa un monto válido'
    return
  }
  emit('submit', parsed)
}
</script>

<template>
  <AppModal
    :open="open"
    title="Aportar a la meta"
    :subtitle="goal ? goal.name : ''"
    @close="emit('close')"
  >
    <form v-if="goal" class="space-y-5" @submit.prevent="handleSubmit">
      <div class="rounded-xl bg-realm-800/60 px-4 py-3 text-sm text-slate-300">
        Progreso:
        <span class="font-semibold text-gold-400">
          {{ money(goal.currentAmount) }} / {{ money(goal.targetAmount) }}
        </span>
        <p class="mt-1 text-xs text-slate-500">
          El aporte se descuenta de tu balance disponible.
        </p>
      </div>

      <AppInput
        v-model="amount"
        label="Monto a aportar"
        type="number"
        inputmode="decimal"
        placeholder="0"
        :min="0"
        :error="amountError"
      />

      <div class="flex gap-3">
        <AppButton type="button" variant="ghost" block @click="emit('close')">
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" block>Aportar</AppButton>
      </div>
    </form>
  </AppModal>
</template>
