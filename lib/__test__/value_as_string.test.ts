import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.100.0/testing/asserts.ts";

import { createConfiguration } from "../create_configuration.ts";
import { ConfigurationException } from "../erorrs.ts";

const config = createConfiguration({
  someString: "value",
  someNumber: 1,
  someNested: { value: 1 },
  thruthy: true,
  falsy: false,
});

Deno.test(".value.asString.exists", () => {
  // exists
  assertEquals(config.get("someString").value.asString.exists, true);
  assertEquals(config.get("someNumber").value.asString.exists, true);
  assertEquals(config.get("someNested").value.asString.exists, true);
  assertEquals(config.get("thruthy").value.asString.exists, true);
  assertEquals(config.get("falsy").value.asString.exists, true);

  // non-sxists
  assertEquals(config.get("somethingOther").value.asString.exists, false);
});

Deno.test(".value.asString.orDefault", () => {
  assertEquals(
    config.get("someString").value.asString.orDefault("DEFAULT"),
    "value"
  );
  assertEquals(
    config.get("someNumber").value.asString.orDefault("DEFAULT"),
    "1"
  );
  assertEquals(
    config.get("someNested").value.asString.orDefault("DEFAULT"),
    '{"value":1}'
  );
  assertEquals(
    config.get("thruthy").value.asString.orDefault("DEFAULT"),
    "true"
  );
  assertEquals(
    config.get("falsy").value.asString.orDefault("DEFAULT"),
    "false"
  );

  // non-sxists
  assertEquals(
    config.get("somethingOther").value.asString.orDefault("DEFAULT 1"),
    "DEFAULT 1"
  );
  assertEquals(
    config.get("somethingOther").value.asString.orDefault("DEFAULT 2"),
    "DEFAULT 2"
  );
});

Deno.test(".value.asString.nullable", () => {
  assertEquals(config.get("someString").value.asString.nullable, "value");
  assertEquals(config.get("somethingOther").value.asString.nullable, null);
});

Deno.test(".value.asString.orThrow", () => {
  assertEquals(config.get("someString").value.asString.orThrow, "value");
  assertThrows(
    () => config.get("somethingOther").value.asString.orThrow,
    ConfigurationException
  );
});
