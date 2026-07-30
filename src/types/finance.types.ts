import type { TransactionType } from './game.types'

export type TransactionSource = 'manual' | 'goal-contribution' | 'fixed-expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  note?: string
  date: string
  createdAt: number
  /** Vincula aportes automáticos a una meta para poder revertirlos. */
  linkedGoalId?: string
  source?: TransactionSource
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  completedAt?: number
  createdAt: number
}

export interface BudgetCategoryLimit {
  categoryId: string
  limit: number
}

export interface BudgetPeriod {
  id: string
  month: string
  /** Tope total del mes; se deriva de la suma de categorías. */
  limit: number
  categories: BudgetCategoryLimit[]
  rewardClaimedAt?: number
}

export interface FixedExpense {
  id: string
  month: string
  name: string
  amount: number
  /** Si ya se pagó este mes; el monto igual queda reservado del disponible. */
  paid: boolean
  paidAt?: number
  createdAt: number
}

export interface FinanceSummary {
  totalIncome: number
  /** Gastos de consumo (sin ahorros ni fijos). */
  totalExpenses: number
  /**
   * Dinero realmente disponible para el auxilio del mes:
   * ingresos − gastos − aportes a metas − todos los fijos (pagados o no).
   */
  balance: number
  /** Caja sin restar fijos pendientes (sirve al patrimonio del reino). */
  cashOnHand: number
  fixedTotal: number
  fixedPaid: number
  fixedPending: number
  savingsRate: number
}

export interface FixedExpenseSummary {
  total: number
  paid: number
  pending: number
  count: number
  paidCount: number
  pendingCount: number
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  category: string
  note?: string
  date?: string
  linkedGoalId?: string
  source?: TransactionSource
}

export interface UpdateTransactionInput {
  amount: number
  category: string
  note?: string
  date: string
}

export interface CreateGoalInput {
  name: string
  targetAmount: number
  deadline?: string
  initialAmount?: number
}

export interface UpdateGoalInput {
  name: string
  targetAmount: number
  deadline?: string
}

export interface ContributeGoalInput {
  amount: number
}

export interface UpsertBudgetInput {
  month: string
  categories: BudgetCategoryLimit[]
}

export interface CreateFixedExpenseInput {
  name: string
  amount: number
  paid?: boolean
}

export interface UpdateFixedExpenseInput {
  name: string
  amount: number
}

export interface BudgetCategoryStatus {
  categoryId: string
  limit: number
  spent: number
  remaining: number
  progressPercent: number
  isOverBudget: boolean
}

export interface BudgetStatus {
  budget: BudgetPeriod | null
  spent: number
  remaining: number
  progressPercent: number
  isOverBudget: boolean
  isMet: boolean
  canClaimReward: boolean
  categories: BudgetCategoryStatus[]
}

export interface GoalProgress {
  goal: SavingsGoal
  progressPercent: number
  remaining: number
  isCompleted: boolean
}
