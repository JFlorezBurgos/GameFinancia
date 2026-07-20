import { storeToRefs } from 'pinia'
import { formatCurrency, formatDate, formatMonthLabel, formatPercent } from '@/utils/format'
import { useSettingsStore } from '@/stores/settings.store'

export function useFinanceFormat() {
  const settingsStore = useSettingsStore()
  const { settings } = storeToRefs(settingsStore)

  function money(amount: number): string {
    return formatCurrency(amount, settings.value.currency, settings.value.locale)
  }

  function date(dateKey: string): string {
    return formatDate(dateKey, settings.value.locale)
  }

  function month(monthKey: string): string {
    return formatMonthLabel(monthKey, settings.value.locale)
  }

  function percent(value: number): string {
    return formatPercent(value)
  }

  return {
    money,
    date,
    month,
    percent,
    currency: settings.value.currency,
    locale: settings.value.locale,
  }
}
