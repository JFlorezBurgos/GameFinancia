<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import MedalCard from '@/components/game/MedalCard.vue'
import StreakCard from '@/components/game/StreakCard.vue'
import BackupCard from '@/components/settings/BackupCard.vue'
import { useTheme } from '@/composables/useTheme'
import { useMedalsStore } from '@/stores/medals.store'
import { usePlayerStore } from '@/stores/player.store'

const { isDark, toggleTheme } = useTheme()
const playerStore = usePlayerStore()
const medalsStore = useMedalsStore()
const { profile, levelProgress } = storeToRefs(playerStore)
const { medalCards, unlockedCount, totalCount } = storeToRefs(medalsStore)
</script>

<template>
  <div class="space-y-5">
    <AppHeader title="Perfil" subtitle="Tu leyenda financiera.">
      <template #actions>
        <AppIconButton
          :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
          @click="toggleTheme"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </AppIconButton>
      </template>
    </AppHeader>

    <AppCard padding="lg">
      <div class="flex items-center gap-4">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-realm-600 to-realm-800 text-2xl ring-1 ring-white/10"
        >
          🛡️
        </div>
        <div>
          <p class="text-lg font-bold text-slate-50">{{ profile.displayName }}</p>
          <p class="text-sm text-slate-400">
            Nivel {{ levelProgress.level }} · {{ levelProgress.title }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            {{ unlockedCount }}/{{ totalCount }} medallas · {{ profile.totalXpEarned }} XP total
          </p>
        </div>
      </div>
    </AppCard>

    <StreakCard />

    <section class="space-y-3">
      <h2 class="px-1 text-sm font-semibold uppercase tracking-widest text-slate-400">
        Medallas
      </h2>
      <div class="grid grid-cols-2 gap-3">
        <MedalCard v-for="medal in medalCards" :key="medal.id" :medal="medal" />
      </div>
    </section>

    <BackupCard />
  </div>
</template>
