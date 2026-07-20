<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import type { CreateGoalInput, SavingsGoal, UpdateGoalInput } from '@/types'

interface Props {
  open: boolean
  goal?: SavingsGoal | null
}

const props = withDefaults(defineProps<Props>(), {
  goal: null,
})

const emit = defineEmits<{
  close: []
  submit: [input: CreateGoalInput | UpdateGoalInput]
}>()

const name = ref('')
const targetAmount = ref('')
const deadline = ref('')
const initialAmount = ref('')
const nameError = ref('')
const targetError = ref('')
const isSubmitting = ref(false)

const isEdit = computed(() => Boolean(props.goal))

function resetForm(): void {
  name.value = ''
  targetAmount.value = ''
  deadline.value = ''
  initialAmount.value = ''
  nameError.value = ''
  targetError.value = ''
  isSubmitting.value = false
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.goal) {
      name.value = props.goal.name
      targetAmount.value = String(props.goal.targetAmount)
      deadline.value = props.goal.deadline ?? ''
      initialAmount.value = ''
    } else {
      resetForm()
    }
  },
)

function validate(): boolean {
  nameError.value = ''
  targetError.value = ''

  if (!name.value.trim()) {
    nameError.value = 'Escribe un nombre para la meta'
    return false
  }

  const target = Number(targetAmount.value)
  if (!targetAmount.value || Number.isNaN(target) || target <= 0) {
    targetError.value = 'Ingresa un monto objetivo válido'
    return false
  }

  return true
}

function handleSubmit(): void {
  if (!validate() || isSubmitting.value) return
  isSubmitting.value = true

  if (isEdit.value) {
    emit('submit', {
      name: name.value,
      targetAmount: Number(targetAmount.value),
      deadline: deadline.value || undefined,
    })
  } else {
    const initial = Number(initialAmount.value)
    emit('submit', {
      name: name.value,
      targetAmount: Number(targetAmount.value),
      deadline: deadline.value || undefined,
      initialAmount: Number.isNaN(initial) || initial <= 0 ? 0 : initial,
    })
  }

  isSubmitting.value = false
}
</script>

<template>
  <AppModal
    :open="open"
    :title="isEdit ? 'Editar meta' : 'Nueva meta'"
    :subtitle="isEdit ? 'Ajusta tu objetivo de ahorro.' : 'Ponle nombre, monto y opcionalmente una fecha.'"
    @close="emit('close')"
  >
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <AppInput
        v-model="name"
        label="Nombre"
        placeholder="Ej. Vacaciones, Fondo de emergencia"
        :error="nameError"
      />

      <AppInput
        v-model="targetAmount"
        label="Monto objetivo"
        type="number"
        inputmode="decimal"
        placeholder="0"
        :min="0"
        :error="targetError"
      />

      <AppInput
        v-if="!isEdit"
        v-model="initialAmount"
        label="Aporte inicial (opcional)"
        type="number"
        inputmode="decimal"
        placeholder="0"
        :min="0"
      />

      <AppInput v-model="deadline" label="Fecha límite (opcional)" type="date" />

      <div class="flex gap-3">
        <AppButton type="button" variant="ghost" block @click="emit('close')">
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" block :disabled="isSubmitting">
          {{ isEdit ? 'Guardar' : 'Crear meta' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>
