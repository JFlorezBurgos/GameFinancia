import type { XpReward } from '@/types'

export const XP_REWARDS: XpReward[] = [
  { event: 'transaction.income', amount: 20, label: 'Ingreso registrado' },
  { event: 'transaction.expense', amount: 5, label: 'Gasto registrado' },
  { event: 'budget.met', amount: 100, label: 'Presupuesto cumplido' },
  { event: 'goal.completed', amount: 1000, label: 'Meta completada' },
  { event: 'streak.maintained', amount: 15, label: 'Racha mantenida' },
]

export const XP_REWARD_MAP = Object.fromEntries(
  XP_REWARDS.map((reward) => [reward.event, reward]),
) as Record<XpReward['event'], XpReward>
