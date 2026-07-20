import { KINGDOM_STAGES } from './kingdom.catalog'
import type { KingdomProgressInput, KingdomSnapshot, KingdomStageDefinition } from '@/types/kingdom.types'

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function getStageForBalance(netWorth: number): KingdomStageDefinition {
  const worth = Math.max(0, netWorth)
  const sorted = [...KINGDOM_STAGES].sort((a, b) => b.minBalance - a.minBalance)
  return sorted.find((stage) => worth >= stage.minBalance) ?? KINGDOM_STAGES[0]!
}

export function getNextStage(current: KingdomStageDefinition): KingdomStageDefinition | null {
  const index = KINGDOM_STAGES.findIndex((stage) => stage.id === current.id)
  return KINGDOM_STAGES[index + 1] ?? null
}

export function calculateProgressToNext(
  netWorth: number,
  current: KingdomStageDefinition,
  next: KingdomStageDefinition | null,
): { percent: number; amountToNext: number | null } {
  if (!next) {
    return { percent: 100, amountToNext: null }
  }

  const span = next.minBalance - current.minBalance
  if (span <= 0) return { percent: 100, amountToNext: 0 }

  const progressed = Math.max(0, netWorth - current.minBalance)
  const percent = clamp(Math.round((progressed / span) * 1000) / 10, 0, 100)
  const amountToNext = Math.max(0, next.minBalance - netWorth)

  return { percent, amountToNext }
}

/**
 * KingdomEngine — puro, sin Vue.
 * El progreso visual depende únicamente del patrimonio neto: determina
 * qué etapa (y por lo tanto qué ilustración) corresponde mostrar.
 */
export class KingdomEngine {
  buildSnapshot(input: KingdomProgressInput): KingdomSnapshot {
    const netWorth = Math.max(0, input.netWorth)
    const currentStage = getStageForBalance(netWorth)
    const nextStage = getNextStage(currentStage)
    const { percent, amountToNext } = calculateProgressToNext(netWorth, currentStage, nextStage)

    const monthDeltaPercent =
      typeof input.previousMonthNetWorth === 'number' && input.previousMonthNetWorth > 0
        ? Math.round(
            ((netWorth - input.previousMonthNetWorth) / input.previousMonthNetWorth) * 1000,
          ) / 10
        : null

    return {
      netWorth,
      progressToNextPercent: percent,
      currentStage,
      nextStage,
      amountToNextStage: amountToNext,
      monthDeltaPercent,
    }
  }

  /** Para demos: fuerza un patrimonio neto exacto. */
  buildSnapshotAtBalance(netWorth: number): KingdomSnapshot {
    return this.buildSnapshot({ netWorth })
  }
}

export const kingdomEngine = new KingdomEngine()
