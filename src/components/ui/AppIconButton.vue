<script setup lang="ts">
interface Props {
  label?: string
  ariaLabel?: string
}

defineProps<Props>()
</script>

<template>
  <button
    type="button"
    class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-white/5 hover:text-gold-400"
    :aria-label="ariaLabel ?? label"
  >
    <slot />
  </button>
</template>
