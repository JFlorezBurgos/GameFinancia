<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from '@/components/layout/BottomNav.vue'
import LevelUpModal from '@/components/game/LevelUpModal.vue'
import MedalUnlockModal from '@/components/game/MedalUnlockModal.vue'
import XpToastStack from '@/components/game/XpToastStack.vue'
</script>

<template>
  <div class="mx-auto flex min-h-dvh max-w-lg flex-col">
    <XpToastStack />
    <LevelUpModal />
    <MedalUnlockModal />

    <main class="flex-1 px-4 pb-24 pt-2">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <BottomNav />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
