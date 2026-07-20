import { useDark, usePreferredDark } from '@vueuse/core'
import { watchEffect } from 'vue'

export function useTheme() {
  const preferredDark = usePreferredDark()
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
    initialValue: preferredDark.value ? 'dark' : 'light',
  })

  watchEffect(() => {
    document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
  })

  function toggleTheme(): void {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme,
  }
}
