<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFeedbackStore } from '@/stores/feedback.store'

const feedbackStore = useFeedbackStore()
const { toasts } = storeToRefs(feedbackStore)

function toastAccent(kind: string): string {
  if (kind === 'medal') return 'border-rarity-epic/40 shadow-rarity-epic/10'
  if (kind === 'streak') return 'border-coral-500/40 shadow-coral-500/10'
  return 'border-gold-500/30 shadow-gold-500/10'
}

function toastBadge(kind: string): string {
  if (kind === 'medal') return 'bg-rarity-epic/15 text-rarity-epic'
  if (kind === 'streak') return 'bg-coral-500/15 text-coral-400'
  return 'bg-gold-500/15 text-gold-400'
}

function toastTitleClass(kind: string): string {
  if (kind === 'medal') return 'text-rarity-epic'
  if (kind === 'streak') return 'text-coral-400'
  return 'text-gold-400'
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-0 z-[120] flex flex-col items-center gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))]"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border bg-realm-900/95 px-4 py-3 shadow-xl backdrop-blur-xl"
        :class="toastAccent(toast.kind)"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
            :class="toastBadge(toast.kind)"
          >
            {{ toast.kind === 'medal' ? '🏅' : toast.kind === 'streak' ? '🔥' : 'XP' }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-bold" :class="toastTitleClass(toast.kind)">{{ toast.title }}</p>
            <p class="truncate text-xs text-slate-400">{{ toast.subtitle }}</p>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
