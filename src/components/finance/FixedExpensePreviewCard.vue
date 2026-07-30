<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import type { FixedExpenseSummary } from '@/types'

interface Props {
  summary: FixedExpenseSummary
  monthLabel: string
}

const props = defineProps<Props>()
const router = useRouter()
const { money } = useFinanceFormat()

const hasItems = computed(() => props.summary.count > 0)
</script>

<template>
  <AppCard padding="md">
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-medium uppercase tracking-widest text-slate-500">
            Gastos fijos · {{ monthLabel }}
          </p>
          <p class="mt-1 font-semibold text-slate-100">
            {{ hasItems ? money(summary.total) : 'Sin fijos' }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            Obligaciones del mes. No forman parte de tu auxilio.
          </p>
        </div>
        <AppButton size="sm" variant="ghost" @click="router.push('/gastos-fijos')">
          Ver
        </AppButton>
      </div>

      <div v-if="hasItems" class="grid grid-cols-2 gap-2 text-xs">
        <div class="rounded-xl bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-500/20">
          <p class="text-emerald-400/80">Pagados</p>
          <p class="mt-0.5 font-semibold text-emerald-400">{{ money(summary.paid) }}</p>
        </div>
        <div class="rounded-xl bg-gold-500/10 px-3 py-2 ring-1 ring-gold-500/20">
          <p class="text-gold-400/80">Pendientes</p>
          <p class="mt-0.5 font-semibold text-gold-400">{{ money(summary.pending) }}</p>
        </div>
      </div>
    </div>
  </AppCard>
</template>
