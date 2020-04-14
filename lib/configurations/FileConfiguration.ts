import { Option } from 'nanoption';

import { AbstractConfiguration } from '../AbstractConfiguration';
import { ConfigDict } from '../ConfigDict';
import { ParseFile } from './fileParsers/ParseFile';

export class FileConfiguration extends AbstractConfiguration {
  private readonly configDict: ConfigDict;

  public constructor(filePath: string, fileParse: ParseFile) {
    super();
    this.configDict = fileParse(filePath);
  }

  public get = (key: string) => Option.of(this.configDict[key]);

  public isDev = () =>
    this.getString('appEnv')
      .map((env) => env === 'development')
      .getOrElse(false);
}
