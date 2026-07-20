import type { TransactionType } from './game.types'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  note?: string
  date: string
  createdAt: number
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

export interface BudgetPeriod {
  id: string
  month: string
  limit: number
  rewardClaimedAt?: number
}

export interface FinanceSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  savingsRate: number
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  category: string
  note?: string
  date?: string
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
  limit: number
}

export interface BudgetStatus {
  budget: BudgetPeriod | null
  spent: number
  remaining: number
  progressPercent: number
  isOverBudget: boolean
  isMet: boolean
  canClaimReward: boolean
}

export interface GoalProgress {
  goal: SavingsGoal
  progressPercent: number
  remaining: number
  isCompleted: boolean
}
