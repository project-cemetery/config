import { Option } from 'tsoption'

export default interface Configuration {
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

  isDev(): boolean
  isProd(): boolean
}
