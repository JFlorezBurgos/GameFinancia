<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
import { getCategoryIcon, getCategoryLabel } from '@/game'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import type { Transaction } from '@/types'

interface Props {
  transaction: Transaction
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [transaction: Transaction]
  delete: [id: string]
}>()

const { money } = useFinanceFormat()
</script>

<template>
  <AppCard padding="md" interactive class="group">
    <div class="flex items-center gap-3">
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
        :class="
          transaction.type === 'income'
            ? 'bg-emerald-500/15 ring-1 ring-emerald-500/20'
            : 'bg-coral-500/15 ring-1 ring-coral-500/20'
        "
      >
        {{ getCategoryIcon(transaction.type, transaction.category) }}
      </div>

      <div class="min-w-0 flex-1">
        <p class="truncate font-semibold text-slate-100">
          {{ getCategoryLabel(transaction.type, transaction.category) }}
        </p>
        <p v-if="transaction.note" class="truncate text-xs text-slate-500">
          {{ transaction.note }}
        </p>
        <p v-else class="text-xs text-slate-500">
          {{
            transaction.source === 'goal-contribution'
              ? 'Aporte a meta'
              : transaction.source === 'fixed-expense'
                ? 'Gasto fijo'
                : transaction.type === 'income'
                  ? 'Ingreso'
                  : 'Gasto'
          }}
        </p>
      </div>

      <div class="shrink-0 text-right">
        <p
          class="font-bold tabular-nums"
          :class="transaction.type === 'income' ? 'text-emerald-400' : 'text-coral-400'"
        >
          {{ transaction.type === 'income' ? '+' : '−' }}{{ money(transaction.amount) }}
        </p>
        <div class="mt-1 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
          <button
            v-if="transaction.source !== 'goal-contribution'"
            type="button"
            class="text-[10px] font-medium uppercase tracking-wide text-slate-400 hover:text-gold-400"
            @click="emit('edit', transaction)"
          >
            Editar
          </button>
          <button
            type="button"
            class="text-[10px] font-medium uppercase tracking-wide text-slate-400 hover:text-coral-400"
            @click="emit('delete', transaction.id)"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  </AppCard>
</template>
