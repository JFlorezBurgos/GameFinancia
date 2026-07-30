<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { getSelectableCategoriesByType } from '@/game'
import type { CreateTransactionInput, Transaction, TransactionType } from '@/types'
import { getTodayKey } from '@/utils/format'

interface Props {
  open: boolean
  type: TransactionType
  transaction?: Transaction | null
}

const props = withDefaults(defineProps<Props>(), {
  transaction: null,
})

const emit = defineEmits<{
  close: []
  submit: [input: CreateTransactionInput]
}>()

const amount = ref('')
const category = ref('')
const note = ref('')
const date = ref(getTodayKey())
const amountError = ref('')
const categoryError = ref('')
const isSubmitting = ref(false)

const isEdit = computed(() => Boolean(props.transaction))

const categories = computed(() => getSelectableCategoriesByType(props.type))

const title = computed(() => {
  if (isEdit.value) {
    return props.type === 'income' ? 'Editar ingreso' : 'Editar gasto'
  }
  return props.type === 'income' ? 'Nuevo ingreso' : 'Nuevo gasto'
})

const subtitle = computed(() => {
  if (isEdit.value) return 'Actualiza los detalles del movimiento.'
  return props.type === 'income'
    ? 'Añade un ingreso a tu registro.'
    : 'Añade un gasto a tu registro.'
})

function resetForm(): void {
  amount.value = ''
  category.value = categories.value[0]?.id ?? ''
  note.value = ''
  date.value = getTodayKey()
  amountError.value = ''
  categoryError.value = ''
  isSubmitting.value = false
}

function loadTransaction(transaction: Transaction): void {
  amount.value = String(transaction.amount)
  category.value = transaction.category
  note.value = transaction.note ?? ''
  date.value = transaction.date
  amountError.value = ''
  categoryError.value = ''
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    if (props.transaction) {
      loadTransaction(props.transaction)
    } else {
      resetForm()
    }
  },
)

watch(
  () => props.type,
  () => {
    if (!props.transaction) {
      category.value = categories.value[0]?.id ?? ''
    }
  },
)

function validate(): boolean {
  amountError.value = ''
  categoryError.value = ''

  const parsed = Number(amount.value)
  if (!amount.value || Number.isNaN(parsed) || parsed <= 0) {
    amountError.value = 'Ingresa un monto válido mayor a 0'
    return false
  }

  if (!category.value) {
    categoryError.value = 'Selecciona una categoría'
    return false
  }

  return true
}

async function handleSubmit(): Promise<void> {
  if (!validate() || isSubmitting.value) return

  isSubmitting.value = true

  emit('submit', {
    type: props.type,
    amount: Number(amount.value),
    category: category.value,
    note: note.value || undefined,
    date: date.value,
  })

  isSubmitting.value = false
}
</script>

<template>
  <AppModal :open="open" :title="title" :subtitle="subtitle" @close="emit('close')">
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <AppInput
        v-model="amount"
        label="Monto"
        type="number"
        inputmode="decimal"
        placeholder="0"
        :min="0"
        :step="1"
        :error="amountError"
      />

      <div class="space-y-2">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Categoría</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="item in categories"
            :key="item.id"
            type="button"
            class="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all"
            :class="
              category === item.id
                ? 'border-gold-500/40 bg-gold-500/10 text-gold-400'
                : 'border-white/10 bg-realm-900/40 text-slate-300 hover:border-white/20'
            "
            @click="category = item.id"
          >
            <span>{{ item.icon }}</span>
            <span class="truncate font-medium">{{ item.label }}</span>
          </button>
        </div>
        <p v-if="categoryError" class="text-xs text-coral-400">{{ categoryError }}</p>
      </div>

      <AppInput v-model="date" label="Fecha" type="date" />

      <AppInput
        v-model="note"
        label="Nota (opcional)"
        placeholder="¿De qué se trata?"
      />

      <div class="flex gap-3 pt-1">
        <AppButton type="button" variant="ghost" block @click="emit('close')">
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" block :disabled="isSubmitting">
          {{ isEdit ? 'Guardar' : 'Registrar' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>
