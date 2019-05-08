import { Option } from 'tsoption'

import { Configuration } from './Configuration'
import { dateIsValid } from './helpers/dateIsValid'
import { ParameterNotFound } from './exceptions/ParameterNotFound'
import { getValueOrThrow } from 'helpers/getValueOfThrow'

export abstract class AbstractConfiguration implements Configuration {
  public abstract get(key: string): Option<string>

  public getString = (key: string) => this.get(key)
  public getNumber = (key: string) => this.get(key).map(Number)
  public getBoolean = (key: string) =>
    this.get(key)
      .map(JSON.parse)
      .map(Boolean)
  public getDate = (key: string) =>
    this.get(key)
      .map(value => new Date(value))
      .map(date => (dateIsValid(date) ? date : null))

  public getOrElse = (key: string, or: string) => this.get(key).getOrElse(or)
  public getStringOrElse = (key: string, or: string) =>
    this.getString(key).getOrElse(or)
  public getNumberOrElse = (key: string, or: number) =>
    this.getNumber(key).getOrElse(or)
  public getBooleanOrElse = (key: string, or: boolean) =>
    this.getBoolean(key).getOrElse(or)
  public getDateOrElse = (key: string, or: Date) =>
    this.getDate(key).getOrElse(or)

  public getOrThrow = (key: string) => getValueOrThrow(key, this.get(key))
  public getStringOrThrow = (key: string) =>
    getValueOrThrow(key, this.getString(key))
  public getNumberOrThrow = (key: string) =>
    getValueOrThrow(key, this.getNumber(key))
  public getBooleanOrThrow = (key: string) =>
    getValueOrThrow(key, this.getBoolean(key))
  public getDateOrThrow = (key: string) =>
    getValueOrThrow(key, this.getDate(key))

  public abstract isDev(): boolean
  public isProd = () => !this.isDev()
}
