<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useFeedbackStore } from '@/stores/feedback.store'

const feedbackStore = useFeedbackStore()
const { levelUp } = storeToRefs(feedbackStore)
</script>

<template>
  <AppModal
    :open="Boolean(levelUp)"
    title="¡Subiste de nivel!"
    subtitle="Tu reino se vuelve más poderoso."
    @close="feedbackStore.dismissLevelUp()"
  >
    <div v-if="levelUp" class="space-y-5 text-center">
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-gold-500/25 to-realm-600/40 text-3xl font-bold text-gold-400 ring-1 ring-gold-500/30">
        {{ levelUp.levelProgress.level }}
      </div>

      <div>
        <p class="text-xl font-bold text-slate-50">{{ levelUp.levelProgress.title }}</p>
        <p class="mt-1 text-sm text-slate-400">
          Nivel {{ levelUp.previousLevel }} → {{ levelUp.levelProgress.level }}
        </p>
      </div>

      <p class="rounded-xl bg-gold-500/10 px-4 py-3 text-sm text-gold-400">
        +{{ levelUp.xpGained }} XP · {{ levelUp.label }}
      </p>

      <AppButton variant="primary" block @click="feedbackStore.dismissLevelUp()">
        Continuar
      </AppButton>
    </div>
  </AppModal>
</template>
