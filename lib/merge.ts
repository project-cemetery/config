import { Configuration } from "./types.ts";
import { createConfiguration } from "./create.ts";

export function mergeConfigurations(
  ...configs: Array<Configuration>
): Configuration {
  return createConfiguration((key) => {
    for (const config of configs) {
      const value = config.get(key).asIs;

      if (value != undefined) {
        return value;
      }
    }

    return undefined;
  });
}
