<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'

interface Props {
  open: boolean
  title: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: undefined,
})

const emit = defineEmits<{
  close: []
}>()

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) {
    emit('close')
  }
}

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
        @click.self="emit('close')"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div
          class="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] border border-white/10 bg-realm-900 p-5 shadow-2xl sm:rounded-[1.75rem]"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <div class="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-slate-50">{{ title }}</h2>
              <p v-if="subtitle" class="mt-1 text-sm text-slate-400">{{ subtitle }}</p>
            </div>
            <AppIconButton aria-label="Cerrar" @click="emit('close')">✕</AppIconButton>
          </div>

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
