import * as changeCase from 'change-case'
import { Option } from 'tsoption'

import AbstractConfiguration from '../AbstractConfiguration'
import ConfigDict from '../ConfigDict'
import dotEnvParse from './fileParsers/dotEnvParse'

export default class DotEnvConfiguration extends AbstractConfiguration {
  private readonly configDict: ConfigDict

  public constructor(filePath: string) {
    super()
    this.configDict = dotEnvParse(filePath)
  }

  public get = (key: string) =>
    Option.of(this.configDict[changeCase.constantCase(key)])

  public isDev = () =>
    this.getString('nodeEnv')
      .map(env => env === 'development')
      .getOrElse(false)
}
