<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import type { FinanceSummary } from '@/types'

interface Props {
  summary: FinanceSummary
  monthLabel?: string
}

withDefaults(defineProps<Props>(), {
  monthLabel: undefined,
})

const { money, percent } = useFinanceFormat()
</script>

<template>
  <AppCard padding="lg" class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-emerald-500/5" />

    <div class="relative space-y-4">
      <div v-if="monthLabel" class="text-xs font-medium uppercase tracking-widest text-slate-500">
        {{ monthLabel }}
      </div>

      <div>
        <p class="text-sm text-slate-400">Balance del periodo</p>
        <p
          class="mt-1 text-3xl font-bold tracking-tight"
          :class="summary.balance >= 0 ? 'text-gradient-gold' : 'text-coral-400'"
        >
          {{ money(summary.balance) }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
          <p class="text-xs text-emerald-400/80">Ingresos</p>
          <p class="mt-1 font-semibold text-emerald-400">{{ money(summary.totalIncome) }}</p>
        </div>
        <div class="rounded-xl bg-coral-500/10 p-3 ring-1 ring-coral-500/20">
          <p class="text-xs text-coral-400/80">Gastos</p>
          <p class="mt-1 font-semibold text-coral-400">{{ money(summary.totalExpenses) }}</p>
        </div>
      </div>

      <AppProgressBar
        :value="summary.savingsRate"
        :max="100"
        :label="`Tasa de ahorro · ${percent(summary.savingsRate)}`"
        color="emerald"
      />
    </div>
  </AppCard>
</template>
