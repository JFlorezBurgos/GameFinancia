import type { MedalDefinition } from '@/types'

export const MEDALS: MedalDefinition[] = [
  {
    id: 'first-income',
    name: 'Primer Tributo',
    description: 'Registra tu primer ingreso.',
    rarity: 'common',
    icon: '💰',
    conditionKey: 'first_income',
  },
  {
    id: 'first-expense',
    name: 'Primer Gasto',
    description: 'Registra tu primer gasto consciente.',
    rarity: 'common',
    icon: '🧾',
    conditionKey: 'first_expense',
  },
  {
    id: 'first-savings',
    name: 'Primer Tesoro',
    description: 'Aporta por primera vez a una meta.',
    rarity: 'common',
    icon: '🏺',
    conditionKey: 'first_savings',
  },
  {
    id: 'first-goal',
    name: 'Arquitecto del Reino',
    description: 'Crea tu primera meta de ahorro.',
    rarity: 'uncommon',
    icon: '🎯',
    conditionKey: 'first_goal',
  },
  {
    id: 'streak-3',
    name: 'Llama Encendida',
    description: 'Mantén una racha de 3 días.',
    rarity: 'uncommon',
    icon: '🔥',
    conditionKey: 'streak_3_days',
  },
  {
    id: 'streak-7',
    name: 'Guardián Constante',
    description: '7 días registrando movimientos.',
    rarity: 'rare',
    icon: '🛡️',
    conditionKey: 'streak_7_days',
  },
  {
    id: 'streak-30',
    name: 'Disciplina de Hierro',
    description: '30 días de racha diaria.',
    rarity: 'epic',
    icon: '⚔️',
    conditionKey: 'streak_30_days',
  },
  {
    id: 'goal-completed',
    name: 'Cazatesoros',
    description: 'Completa tu primera meta.',
    rarity: 'rare',
    icon: '🏆',
    conditionKey: 'goal_completed',
  },
  {
    id: 'level-5',
    name: 'Administrador',
    description: 'Alcanza el nivel 5.',
    rarity: 'rare',
    icon: '⭐',
    conditionKey: 'level_5',
  },
  {
    id: 'million-saved',
    name: 'Cofre del Millón',
    description: 'Acumula un millón en ahorros.',
    rarity: 'legendary',
    icon: '👑',
    conditionKey: 'million_saved',
  },
  {
    id: 'discipline-12',
    name: 'Disciplina Anual',
    description: '12 meses con al menos un movimiento.',
    rarity: 'epic',
    icon: '📅',
    conditionKey: 'discipline_12_months',
  },
  {
    id: 'budget-guardian',
    name: 'Guardián del Presupuesto',
    description: 'Reclama tu primera recompensa de presupuesto.',
    rarity: 'uncommon',
    icon: '🧭',
    conditionKey: 'budget_claimed',
  },
]

export const MEDAL_MAP = Object.fromEntries(MEDALS.map((medal) => [medal.id, medal])) as Record<
  string,
  MedalDefinition
>

export const RARITY_LABELS: Record<MedalDefinition['rarity'], string> = {
  common: 'Común',
  uncommon: 'Poco común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
  mythic: 'Mítico',
}
