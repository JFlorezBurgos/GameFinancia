export * from './game.types'
export * from './player.types'
export * from './finance.types'
export * from './city.types'
export * from './kingdom.types'
export * from './settings.types'
export * from './backup.types'

export interface Repository<T> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | undefined>
  save(entity: T): Promise<void>
  delete(id: string): Promise<void>
}
