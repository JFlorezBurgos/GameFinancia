<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useBackupStore } from '@/stores/backup.store'
import type { BackupSummary } from '@/types'

const backupStore = useBackupStore()

const fileInput = ref<HTMLInputElement | null>(null)
const pendingFile = ref<File | null>(null)
const isConfirmOpen = ref(false)
const restoredSummary = ref<BackupSummary | null>(null)

function openFilePicker(): void {
  fileInput.value?.click()
}

function onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  input.value = ''

  if (!file) return

  pendingFile.value = file
  isConfirmOpen.value = true
}

function closeConfirm(): void {
  if (backupStore.isImporting) return
  isConfirmOpen.value = false
  pendingFile.value = null
}

async function confirmRestore(): Promise<void> {
  if (!pendingFile.value) return

  try {
    restoredSummary.value = await backupStore.importBackup(pendingFile.value)
    isConfirmOpen.value = false
    pendingFile.value = null
    window.setTimeout(() => window.location.reload(), 1200)
  } catch {
    // El error ya queda visible vía backupStore.error
  }
}

async function handleExport(): Promise<void> {
  try {
    await backupStore.exportBackup()
  } catch {
    // El error ya queda visible vía backupStore.error
  }
}
</script>

<template>
  <AppCard padding="lg" class="space-y-4">
    <div>
      <h2 class="text-sm font-semibold uppercase tracking-widest text-slate-400">
        Respaldo y restauración
      </h2>
      <p class="mt-1 text-xs leading-snug text-slate-500">
        Toda tu información vive solo en este dispositivo. Descarga un respaldo periódicamente
        para no perder tu progreso.
      </p>
    </div>

    <div class="space-y-2">
      <AppButton variant="secondary" block :disabled="backupStore.isExporting" @click="handleExport">
        {{ backupStore.isExporting ? 'Generando respaldo…' : '⬇️ Descargar respaldo (.json)' }}
      </AppButton>

      <p v-if="backupStore.lastExportSummary" class="text-center text-[11px] text-slate-500">
        Último respaldo: {{ backupStore.lastExportSummary.transactions }} movimientos ·
        {{ backupStore.lastExportSummary.goals }} metas ·
        {{ backupStore.lastExportSummary.fixedExpenses }} fijos ·
        {{ backupStore.lastExportSummary.medals }} medallas
      </p>
    </div>

    <div class="space-y-2 border-t border-white/5 pt-4">
      <AppButton variant="ghost" block :disabled="backupStore.isImporting" @click="openFilePicker">
        {{ backupStore.isImporting ? 'Restaurando…' : '⬆️ Restaurar desde archivo' }}
      </AppButton>
      <p class="text-center text-[11px] text-slate-500">
        Restaurar reemplaza toda la información actual de la app.
      </p>
      <input
        ref="fileInput"
        type="file"
        accept="application/json"
        class="hidden"
        @change="onFileSelected"
      />
    </div>

    <p v-if="backupStore.error" class="text-xs text-coral-400">
      {{ backupStore.error }}
    </p>

    <AppModal
      :open="isConfirmOpen"
      title="Restaurar respaldo"
      subtitle="Esta acción reemplazará toda la información actual de la app."
      @close="closeConfirm"
    >
      <div class="space-y-4">
        <p class="text-sm text-slate-300">
          Se borrarán tus movimientos, metas, presupuestos, gastos fijos, medallas y configuración
          actuales, y se reemplazarán por los del archivo
          <span class="font-medium text-slate-100">{{ pendingFile?.name }}</span
          >. Esta acción no se puede deshacer.
        </p>

        <div v-if="restoredSummary" class="rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-300">
          Respaldo restaurado. Recargando la aplicación…
        </div>

        <div class="flex gap-3">
          <AppButton variant="ghost" block :disabled="backupStore.isImporting" @click="closeConfirm">
            Cancelar
          </AppButton>
          <AppButton
            variant="danger"
            block
            :disabled="backupStore.isImporting"
            @click="confirmRestore"
          >
            {{ backupStore.isImporting ? 'Restaurando…' : 'Sí, reemplazar todo' }}
          </AppButton>
        </div>
      </div>
    </AppModal>
  </AppCard>
</template>
