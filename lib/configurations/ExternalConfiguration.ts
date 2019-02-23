import { Option } from 'tsoption'

import { AbstractConfiguration } from '../AbstractConfiguration'
import { ConfigDict } from '../ConfigDict'

export class ExternalConfiguration extends AbstractConfiguration {
  public constructor(
    private readonly configDict: ConfigDict,
    private readonly envKey: string,
  ) {
    super()
  }

  public get = (key: string) => Option.of(this.configDict[key])

  public isDev = () =>
    this.getString(this.envKey)
      .map(env => env === 'development')
      .getOrElse(false)
}
