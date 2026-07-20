<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
  type: 'button',
})

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-gold-500 to-gold-600 text-realm-950 shadow-lg shadow-gold-500/20 hover:from-gold-400 hover:to-gold-500',
  secondary: 'glass-card text-slate-100 hover:bg-realm-700/80',
  ghost: 'text-slate-300 hover:bg-white/5',
  danger: 'bg-coral-500/20 text-coral-400 border border-coral-500/30 hover:bg-coral-500/30',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-sm font-semibold',
  lg: 'px-5 py-4 text-base font-semibold',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    :class="[variantClasses[variant], sizeClasses[size], block ? 'w-full' : '']"
  >
    <slot />
  </button>
</template>
