import { createConfiguration } from "./create.ts";

export function createEnvConfiguration() {
  return createConfiguration(Deno.env.get);
}
