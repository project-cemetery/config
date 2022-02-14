import { createConfiguration } from "./create_configuration.ts";

export function createEnvConfiguration() {
  return createConfiguration(Deno.env.get);
}
