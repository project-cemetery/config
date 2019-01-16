import * as changeCase from 'change-case'
import { Option } from 'tsoption'

import AbstractConfiguration from '../AbstractConfiguration'

export default class EnvConfiguration extends AbstractConfiguration {
  public get = (key: string) =>
    Option.of(process.env[changeCase.constantCase(key)])

  public isDev = () =>
    this.getString('nodeEnv')
      .map(env => env === 'development')
      .getOrElse(false)
}
