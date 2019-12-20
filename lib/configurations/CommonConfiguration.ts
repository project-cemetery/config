import { AbstractConfiguration } from 'AbstractConfiguration';
import { Configuration } from 'Configuration';
import { DotEnvConfiguration } from './DotEnvConfiguration';
import { EnvConfiguration } from './EnvConfiguration';

export class CommonComfiguration extends AbstractConfiguration {
  private readonly configuration: Configuration;

  constructor(dotenvFilePath: string) {
    super();

    if (process.env.NODE_ENV !== 'production') {
      this.configuration = new DotEnvConfiguration(dotenvFilePath);
    } else {
      this.configuration = new EnvConfiguration();
    }
  }

  isDev = () => this.configuration.isDev();
  get = (key: string) => this.configuration.get(key);
}
