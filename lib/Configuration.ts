import { Option } from 'tsoption'

export interface Configuration {
  get(key: string): Option<string>
  getString(key: string): Option<string>
  getNumber(key: string): Option<number>
  getBoolean(key: string): Option<boolean>
  getDate(key: string): Option<Date>

  getOrElse(key: string, or: string): string
  getStringOrElse(key: string, or: string): string
  getNumberOrElse(key: string, or: number): number
  getBooleanOrElse(key: string, or: boolean): boolean
  getDateOrElse(key: string, or: Date): Date

  getOrThrow(key: string): string
  getStringOrThrow(key: string): string
  getNumberOrThrow(key: string): number
  getBooleanOrThrow(key: string): boolean
  getDateOrThrow(key: string): Date

  isDev(): boolean
  isProd(): boolean
}
