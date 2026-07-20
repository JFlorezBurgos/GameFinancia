<script setup lang="ts">
interface Props {
  value: number
  max?: number
  label?: string
  color?: 'gold' | 'emerald' | 'coral'
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  label: undefined,
  color: 'gold',
  showValue: false,
})

const percent = () => {
  if (props.max <= 0) return 0
  return Math.min(100, Math.round((props.value / props.max) * 100))
}

const barColors = {
  gold: 'from-gold-400 to-gold-600',
  emerald: 'from-emerald-400 to-emerald-500',
  coral: 'from-coral-400 to-coral-500',
}
</script>

<template>
  <div class="space-y-1.5">
    <div v-if="label || showValue" class="flex items-center justify-between text-xs">
      <span v-if="label" class="text-slate-400">{{ label }}</span>
      <span v-if="showValue" class="font-semibold text-slate-200">
        {{ value }}<span v-if="max" class="text-slate-500"> / {{ max }}</span>
      </span>
    </div>
    <div class="h-2.5 overflow-hidden rounded-full bg-realm-900/80">
      <div
        class="h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out"
        :class="barColors[color]"
        :style="{ width: `${percent()}%` }"
      />
    </div>
  </div>
</template>
