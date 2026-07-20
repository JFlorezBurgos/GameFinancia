<script setup lang="ts">
interface Props {
  padding?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
  interactive: false,
})

const paddingClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}
</script>

<template>
  <article
    class="glass-card rounded-[var(--radius-card)] transition-all duration-300"
    :class="[
      paddingClasses[padding],
      interactive ? 'hover:border-gold-500/20 hover:shadow-lg hover:shadow-gold-500/5' : '',
    ]"
  >
    <slot />
  </article>
</template>
