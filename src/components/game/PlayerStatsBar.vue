<script setup lang="ts">
import { storeToRefs } from 'pinia'
import XpBar from '@/components/game/XpBar.vue'
import { usePlayerStore } from '@/stores/player.store'

const playerStore = usePlayerStore()
const { profile, levelProgress } = storeToRefs(playerStore)
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500/20 to-realm-600/40 text-lg font-bold text-gold-400 ring-1 ring-gold-500/20"
    >
      {{ levelProgress.level }}
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-slate-100">{{ profile.displayName }}</p>
      <XpBar
        :level="levelProgress.level"
        :title="levelProgress.title"
        :current-xp="levelProgress.xpInLevel"
        :xp-for-next-level="levelProgress.xpForNextLevel"
        :progress-percent="levelProgress.progressPercent"
      />
    </div>
  </div>
</template>
