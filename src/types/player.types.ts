export interface PlayerProfile {
  id: string
  displayName: string
  level: number
  xp: number
  totalXpEarned: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  createdAt: number
  updatedAt: number
}

export interface PlayerMedal {
  medalId: string
  unlockedAt: number
}

export interface PlayerBuilding {
  buildingId: string
  unlockedAt: number
}

export interface PlayerQuest {
  questId: string
  status: 'active' | 'completed'
  progress: number
  completedAt?: number
}

export interface PlayerState {
  profile: PlayerProfile
  medals: PlayerMedal[]
  buildings: PlayerBuilding[]
  quests: PlayerQuest[]
}
