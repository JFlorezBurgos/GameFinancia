export interface KingdomStageDefinition {
  id: string
  label: string
  minBalance: number
  maxBalance: number | null
  caption: string
  /** Balance representativo para miniaturas de la timeline y el preview. */
  previewBalance: number
  /** Clave de la ilustración completa de esta etapa (ver kingdom.stage-assets.ts). */
  image: string
}

export interface KingdomProgressInput {
  /** Patrimonio neto / ahorro acumulado (puede bajar). */
  netWorth: number
  previousMonthNetWorth?: number
}

export interface KingdomSnapshot {
  netWorth: number
  progressToNextPercent: number
  currentStage: KingdomStageDefinition
  nextStage: KingdomStageDefinition | null
  amountToNextStage: number | null
  monthDeltaPercent: number | null
}
