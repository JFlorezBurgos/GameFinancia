<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import CityScene from '@/components/city/CityScene.vue'
import { resolveCityAssetUrl } from '@/game'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import { useCityStore } from '@/stores/city.store'

const router = useRouter()
const cityStore = useCityStore()
const { snapshot, cityXp, balance } = storeToRefs(cityStore)
const { money } = useFinanceFormat()

const seasonLabels = {
  spring: 'Primavera',
  summer: 'Verano',
  autumn: 'Otoño',
  winter: 'Invierno',
} as const
</script>

<template>
  <div class="space-y-5">
    <AppHeader
      title="Mi Ciudad"
      subtitle="Crece con tus ingresos. Si el balance cae, vuelve al campo."
    >
      <template #actions>
        <AppButton size="sm" variant="ghost" @click="router.push('/preview/ciudad')">
          Preview
        </AppButton>
      </template>
    </AppHeader>

    <CityScene :snapshot="snapshot" />

    <AppCard padding="md">
      <div class="flex items-start justify-between gap-3">
        <div>
          <AppBadge rarity="legendary">{{ snapshot.stage.label }}</AppBadge>
          <p class="mt-2 text-sm text-slate-400">{{ snapshot.stage.description }}</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-gradient-gold">{{ snapshot.progressPercent }}%</p>
          <p class="text-[10px] uppercase tracking-wide text-slate-500">
            {{ seasonLabels[snapshot.season] }}
          </p>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div class="rounded-xl bg-realm-900/60 px-3 py-2">
          <p class="text-slate-500">XP ciudad</p>
          <p class="mt-0.5 font-semibold text-gold-400">{{ cityXp }}</p>
        </div>
        <div class="rounded-xl bg-realm-900/60 px-3 py-2">
          <p class="text-slate-500">Balance</p>
          <p
            class="mt-0.5 font-semibold"
            :class="balance >= 0 ? 'text-emerald-400' : 'text-coral-400'"
          >
            {{ money(balance) }}
          </p>
        </div>
      </div>

      <AppProgressBar
        class="mt-4"
        :value="snapshot.progressPercent"
        :max="100"
        color="gold"
      />
      <p v-if="snapshot.nextUnlockHint" class="mt-3 text-xs text-slate-500">
        Próximo: {{ snapshot.nextUnlockHint }}
      </p>
    </AppCard>

    <section class="space-y-3">
      <h2 class="px-1 text-sm font-semibold uppercase tracking-widest text-slate-400">
        {{ snapshot.stage.stage === 'campo' ? 'En el campo' : 'Estructuras visibles' }}
      </h2>

      <AppCard
        v-if="snapshot.buildings.length === 0"
        padding="md"
        class="text-center text-sm text-slate-400"
      >
        Estás en campo abierto. Registra ingresos hasta que tu balance sea positivo y aparecerá
        la aldea.
      </AppCard>

      <div v-else class="space-y-2">
        <AppCard
          v-for="building in snapshot.buildings"
          :key="building.id"
          padding="sm"
        >
          <div class="flex items-center gap-3">
            <img
              :src="resolveCityAssetUrl(building.assetKey)"
              :alt="building.name"
              class="h-12 w-12 object-contain"
              draggable="false"
            />
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-slate-100">
                {{ building.name }}
                <span v-if="building.level > 1" class="text-xs text-gold-400">
                  · Nv. {{ building.level }}
                </span>
              </p>
              <p class="truncate text-xs text-slate-500">{{ building.description }}</p>
            </div>
          </div>
        </AppCard>
      </div>
    </section>
  </div>
</template>
