import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.100.0/testing/asserts.ts";

import { createConfiguration } from "../create.ts";
import { ShapeConfigurationException } from "../erorrs.ts";

Deno.test("shape, simple value", () => {
  const config = createConfiguration({ someNumber: 4000 });

  const { port } = config.shape(({ someNumber }) => ({
    port: someNumber.value.asNumber.orThrow,
  }));

  assertEquals(port, 4000);
});

Deno.test("shape, many execptions", () => {
  const config = createConfiguration({});

  assertThrows(
    () =>
      config.shape(({ someNumber, someString }) => ({
        host: someString.value.asString.orThrow,
        port: someNumber.value.asNumber.orThrow,
      })),
    ShapeConfigurationException,
  );
});
