import { Configuration, Shape } from './types';
import { createConfiguration } from './create_configuration';
import { mergeConfigurations } from './merge_configurations';

export class ConfigurationManager implements Configuration {
  private constructor(private readonly config: Configuration) {}

  static fromRecord(record: Record<string, unknown>): ConfigurationManager {
    return new ConfigurationManager(createConfiguration(record));
  }

  static fromManyRecords(
    records: Record<string, unknown>[],
  ): ConfigurationManager {
    return new ConfigurationManager(
      mergeConfigurations(records.map(createConfiguration)),
    );
  }

  static fromConfig(config: Configuration): ConfigurationManager {
    return new ConfigurationManager(config);
  }

  static fromManyConfigs(configs: Configuration[]): ConfigurationManager {
    return new ConfigurationManager(mergeConfigurations(configs));
  }

  get isDev() {
    return this.config.isDev;
  }

  get isProd() {
    return this.config.isProd;
  }

  key = (key: string) => {
    return this.config.key(key);
  };

  shape: Shape = (shapeConfig) => {
    return this.config.shape(shapeConfig);
  };
}
