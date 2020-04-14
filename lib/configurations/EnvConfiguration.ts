import * as changeCase from 'change-case';
import { Option } from 'nanoption';

import { AbstractConfiguration } from '../AbstractConfiguration';

export class EnvConfiguration extends AbstractConfiguration {
  public get = (key: string) =>
    Option.of(process.env[changeCase.constantCase(key)]);

  public isDev = () =>
    this.getString('nodeEnv')
      .map((env) => env === 'development')
      .getOrElse(false);
}
