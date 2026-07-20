<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { RARITY_LABELS } from '@/game'
import { useFeedbackStore } from '@/stores/feedback.store'

const feedbackStore = useFeedbackStore()
const { unlockedMedal } = storeToRefs(feedbackStore)
</script>

<template>
  <AppModal
    :open="Boolean(unlockedMedal)"
    title="¡Medalla desbloqueada!"
    subtitle="Tu leyenda crece en el reino."
    @close="feedbackStore.dismissMedal()"
  >
    <div v-if="unlockedMedal" class="space-y-5 text-center">
      <div
        class="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-gold-500/20 to-realm-600/50 text-5xl ring-1 ring-gold-500/30"
      >
        {{ unlockedMedal.icon }}
      </div>

      <div class="space-y-2">
        <AppBadge :rarity="unlockedMedal.rarity">
          {{ RARITY_LABELS[unlockedMedal.rarity] }}
        </AppBadge>
        <p class="text-xl font-bold text-slate-50">{{ unlockedMedal.name }}</p>
        <p class="text-sm text-slate-400">{{ unlockedMedal.description }}</p>
      </div>

      <AppButton variant="primary" block @click="feedbackStore.dismissMedal()">
        Continuar
      </AppButton>
    </div>
  </AppModal>
</template>
