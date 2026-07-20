<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import KingdomDiorama from '@/components/kingdom/KingdomDiorama.vue'
import KingdomEvolutionTrack from '@/components/kingdom/KingdomEvolutionTrack.vue'
import KingdomProgressPanel from '@/components/kingdom/KingdomProgressPanel.vue'
import KingdomStatsHeader from '@/components/kingdom/KingdomStatsHeader.vue'
import { useKingdomStore } from '@/stores/kingdom.store'

const router = useRouter()
const kingdomStore = useKingdomStore()
const { snapshot } = storeToRefs(kingdomStore)
</script>

<template>
  <div class="space-y-6 pb-4">
    <KingdomStatsHeader :snapshot="snapshot" />

    <!-- Diorama principal: solo escena, sin botones encima -->
    <section class="space-y-2">
      <KingdomDiorama :snapshot="snapshot" />
      <p class="px-1 text-center text-xs text-slate-500">
        {{ snapshot.currentStage.caption }}
      </p>
    </section>

    <KingdomEvolutionTrack :snapshot="snapshot" />

    <KingdomProgressPanel :snapshot="snapshot" />

    <button
      type="button"
      class="w-full text-center text-xs text-slate-600 underline-offset-2 hover:text-slate-400 hover:underline"
      @click="router.push('/preview/reino')"
    >
      Ver simulación de crecimiento
    </button>
  </div>
</template>
