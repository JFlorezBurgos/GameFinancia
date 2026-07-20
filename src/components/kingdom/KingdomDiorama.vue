<script setup lang="ts">
import { computed } from 'vue'
import { resolveKingdomStageImage } from '@/game/kingdom'
import type { KingdomSnapshot } from '@/types/kingdom.types'

interface Props {
  snapshot: KingdomSnapshot
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const src = computed(() => resolveKingdomStageImage(props.snapshot.currentStage.image))
</script>

<template>
  <div
    class="relative aspect-[11/10] w-full overflow-hidden border border-white/5 bg-gradient-to-b from-[#12141c] to-[#0a0b10]"
    :class="compact ? 'rounded-xl' : 'rounded-2xl'"
    aria-hidden="true"
  >
    <Transition name="kingdom-fade" mode="out-in">
      <img
        :key="snapshot.currentStage.id"
        :src="src"
        :alt="snapshot.currentStage.label"
        class="kingdom-breathe absolute inset-0 h-full w-full select-none object-contain"
        draggable="false"
      />
    </Transition>
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
  </div>
</template>

<style scoped>
.kingdom-fade-enter-active,
.kingdom-fade-leave-active {
  transition: opacity 0.5s ease;
}
.kingdom-fade-enter-from,
.kingdom-fade-leave-to {
  opacity: 0;
}
</style>
