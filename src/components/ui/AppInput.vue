<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  error?: string
  min?: number
  step?: number
  inputmode?: 'text' | 'numeric' | 'decimal'
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  type: 'text',
  placeholder: undefined,
  error: undefined,
  min: undefined,
  step: undefined,
  inputmode: 'text',
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<template>
  <label class="block space-y-1.5">
    <span v-if="label" class="text-xs font-medium uppercase tracking-wide text-slate-400">
      {{ label }}
    </span>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :min="min"
      :step="step"
      :inputmode="inputmode"
      class="w-full rounded-xl border bg-realm-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition-colors focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
      :class="error ? 'border-coral-500/50' : 'border-white/10'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-coral-400">{{ error }}</p>
  </label>
</template>
