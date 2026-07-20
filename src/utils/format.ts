const currencyFormatterCache = new Map<string, Intl.NumberFormat>()

export function formatCurrency(
  amount: number,
  currency = 'COP',
  locale = 'es-CO',
): string {
  const key = `${locale}-${currency}`
  let formatter = currencyFormatterCache.get(key)

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    })
    currencyFormatterCache.set(key, formatter)
  }

  return formatter.format(amount)
}

export function formatCompactNumber(value: number, locale = 'es-CO'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function getTodayKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getCurrentMonthKey(): string {
  return getTodayKey().slice(0, 7)
}

export function shiftDateKey(dateKey: string, dayDelta: number): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year!, month! - 1, day!)
  date.setDate(date.getDate() + dayDelta)
  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')
  const nextDay = String(date.getDate()).padStart(2, '0')
  return `${nextYear}-${nextMonth}-${nextDay}`
}

export function getYesterdayKey(today = getTodayKey()): string {
  return shiftDateKey(today, -1)
}

export function formatDate(dateKey: string, locale = 'es-CO'): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year!, month! - 1, day)
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function formatMonthLabel(monthKey: string, locale = 'es-CO'): string {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year!, month! - 1, 1)
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function isToday(dateKey: string): boolean {
  return dateKey === getTodayKey()
}
