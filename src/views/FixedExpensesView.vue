<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import { useFinanceStore } from '@/stores/finance.store'
import { useFixedExpenseStore } from '@/stores/fixed-expense.store'
import type { FixedExpense } from '@/types'

const financeStore = useFinanceStore()
const fixedStore = useFixedExpenseStore()
const { selectedMonth } = storeToRefs(financeStore)
const { isLoading } = storeToRefs(fixedStore)

const { money, month: formatMonth } = useFinanceFormat()

const monthItems = computed(() => fixedStore.getForMonth(selectedMonth.value))
const summary = computed(() => fixedStore.getSummaryForMonth(selectedMonth.value))
const available = computed(() => financeStore.monthSummary.balance)
const monthLabel = computed(() => formatMonth(selectedMonth.value))

const formOpen = ref(false)
const editing = ref<FixedExpense | null>(null)
const name = ref('')
const amount = ref('')
const paid = ref(false)
const formError = ref('')

watch(formOpen, (open) => {
  if (!open) return
  if (editing.value) {
    name.value = editing.value.name
    amount.value = String(editing.value.amount)
    paid.value = editing.value.paid
  } else {
    name.value = ''
    amount.value = ''
    paid.value = false
  }
  formError.value = ''
})

function shiftMonth(delta: number): void {
  const [year, month] = selectedMonth.value.split('-').map(Number)
  const date = new Date(year!, month! - 1 + delta, 1)
  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')
  financeStore.setSelectedMonth(`${nextYear}-${nextMonth}`)
}

function openCreate(): void {
  editing.value = null
  formOpen.value = true
}

function openEdit(item: FixedExpense): void {
  editing.value = item
  formOpen.value = true
}

function closeForm(): void {
  formOpen.value = false
  editing.value = null
}

async function handleSave(): Promise<void> {
  formError.value = ''
  const parsed = Number(amount.value)
  if (!name.value.trim()) {
    formError.value = 'Escribe un nombre'
    return
  }
  if (!amount.value || Number.isNaN(parsed) || parsed <= 0) {
    formError.value = 'Ingresa un monto válido'
    return
  }

  try {
    if (editing.value) {
      await fixedStore.updateFixedExpense(editing.value.id, {
        name: name.value.trim(),
        amount: parsed,
      })
      if (paid.value !== editing.value.paid) {
        await fixedStore.setPaid(editing.value.id, paid.value)
      }
    } else {
      await fixedStore.createFixedExpense(selectedMonth.value, {
        name: name.value.trim(),
        amount: parsed,
        paid: paid.value,
      })
    }
    closeForm()
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'No se pudo guardar'
  }
}

async function togglePaid(item: FixedExpense): Promise<void> {
  try {
    await fixedStore.setPaid(item.id, !item.paid)
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo actualizar')
  }
}

async function handleDelete(id: string): Promise<void> {
  if (!window.confirm('¿Eliminar este gasto fijo?')) return
  await fixedStore.deleteFixedExpense(id)
}
</script>

<template>
  <div class="space-y-5">
    <AppHeader
      title="Gastos fijos"
      subtitle="Obligaciones del mes. Se reservan del disponible aunque no estén pagadas."
    />

    <div class="flex items-center justify-between gap-2">
      <AppIconButton aria-label="Mes anterior" @click="shiftMonth(-1)">‹</AppIconButton>
      <p class="text-sm font-semibold capitalize text-slate-200">{{ monthLabel }}</p>
      <AppIconButton aria-label="Mes siguiente" @click="shiftMonth(1)">›</AppIconButton>
    </div>

    <AppCard padding="md" class="space-y-3">
      <div>
        <p class="text-xs uppercase tracking-widest text-slate-500">Balance de fijos</p>
        <p class="mt-1 text-2xl font-bold text-slate-100">{{ money(summary.total) }}</p>
      </div>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
          <p class="text-xs text-emerald-400/80">Pagados</p>
          <p class="mt-1 font-semibold text-emerald-400">{{ money(summary.paid) }}</p>
          <p class="mt-0.5 text-[10px] text-slate-500">{{ summary.paidCount }} items</p>
        </div>
        <div class="rounded-xl bg-gold-500/10 p-3 ring-1 ring-gold-500/20">
          <p class="text-xs text-gold-400/80">Pendientes</p>
          <p class="mt-1 font-semibold text-gold-400">{{ money(summary.pending) }}</p>
          <p class="mt-0.5 text-[10px] text-slate-500">{{ summary.pendingCount }} items</p>
        </div>
      </div>
      <div class="rounded-xl bg-realm-800/60 px-4 py-3">
        <p class="text-xs text-slate-500">Tu auxilio disponible este mes</p>
        <p
          class="mt-1 text-lg font-bold"
          :class="available >= 0 ? 'text-gold-400' : 'text-coral-400'"
        >
          {{ money(available) }}
        </p>
      </div>
    </AppCard>

    <AppButton variant="primary" block @click="openCreate">+ Nuevo gasto fijo</AppButton>

    <div v-if="isLoading" class="py-8 text-center text-sm text-slate-500">
      Cargando gastos fijos...
    </div>

    <AppCard v-else-if="monthItems.length === 0" padding="lg" class="text-center">
      <p class="text-4xl">📌</p>
      <p class="mt-3 font-semibold text-slate-200">Sin gastos fijos este mes</p>
      <p class="mt-1 text-sm text-slate-400">
        Arriendo, servicios, suscripciones… lo que no puedes tocar.
      </p>
    </AppCard>

    <section v-else class="space-y-2">
      <AppCard
        v-for="item in monthItems"
        :key="item.id"
        padding="md"
      >
        <div class="flex items-start gap-3">
          <button
            type="button"
            class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors"
            :class="
              item.paid
                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                : 'border-white/15 bg-realm-900/40 text-transparent'
            "
            :aria-label="item.paid ? 'Marcar como pendiente' : 'Marcar como pagado'"
            @click="togglePaid(item)"
          >
            <span class="text-xs font-bold">✓</span>
          </button>

          <div class="min-w-0 flex-1">
            <p class="truncate font-semibold text-slate-100">{{ item.name }}</p>
            <p class="text-xs" :class="item.paid ? 'text-emerald-400' : 'text-gold-400'">
              {{ item.paid ? 'Pagado' : 'Pendiente' }}
            </p>
          </div>

          <div class="shrink-0 text-right">
            <p class="font-bold tabular-nums text-slate-100">{{ money(item.amount) }}</p>
            <div class="mt-1 flex justify-end gap-2">
              <button
                type="button"
                class="text-[10px] font-medium uppercase tracking-wide text-slate-400 hover:text-gold-400"
                @click="openEdit(item)"
              >
                Editar
              </button>
              <button
                type="button"
                class="text-[10px] font-medium uppercase tracking-wide text-slate-400 hover:text-coral-400"
                @click="handleDelete(item.id)"
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      </AppCard>
    </section>

    <AppModal
      :open="formOpen"
      :title="editing ? 'Editar gasto fijo' : 'Nuevo gasto fijo'"
      subtitle="Define el valor. Puedes marcarlo como pagado o dejarlo pendiente."
      @close="closeForm"
    >
      <form class="space-y-5" @submit.prevent="handleSave">
        <AppInput
          v-model="name"
          label="Nombre"
          placeholder="Ej. Arriendo, Netflix, gimnasio"
        />
        <AppInput
          v-model="amount"
          label="Valor definido"
          type="number"
          inputmode="decimal"
          placeholder="0"
          :min="0"
        />

        <label class="flex items-center gap-3 rounded-xl border border-white/10 bg-realm-900/40 px-4 py-3">
          <input v-model="paid" type="checkbox" class="h-4 w-4 accent-emerald-500" />
          <span class="text-sm text-slate-200">Marcar como pagado</span>
        </label>

        <p v-if="formError" class="text-xs text-coral-400">{{ formError }}</p>

        <div class="flex gap-3">
          <AppButton type="button" variant="ghost" block @click="closeForm">
            Cancelar
          </AppButton>
          <AppButton type="submit" variant="primary" block>
            {{ editing ? 'Guardar' : 'Agregar' }}
          </AppButton>
        </div>
      </form>
    </AppModal>
  </div>
</template>
