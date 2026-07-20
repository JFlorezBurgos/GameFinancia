<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <header class="safe-top px-4 pb-2 pt-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-slate-50">{{ title }}</h1>
        <p v-if="subtitle" class="mt-0.5 text-sm text-slate-400">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </div>
  </header>
</template>
