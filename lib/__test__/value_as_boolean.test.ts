import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.100.0/testing/asserts.ts";

import { createConfiguration } from "../create.ts";
import { ConfigurationException } from "../erorrs.ts";

const config = createConfiguration({
  someString: "value",
  someNumber: 1,
  someNested: { value: 1 },
  thruthy: true,
  falsy: false,
  booleanStringTrue: "true",
  booleanStringFalse: "false",
});

Deno.test(".value.asBoolean.exists", () => {
  // exists
  assertEquals(config.get("someString").value.asBoolean.exists, true);
  assertEquals(config.get("someNumber").value.asBoolean.exists, true);
  assertEquals(config.get("someNested").value.asBoolean.exists, true);
  assertEquals(config.get("thruthy").value.asBoolean.exists, true);
  assertEquals(config.get("falsy").value.asBoolean.exists, true);

  // non-sxists
  assertEquals(config.get("somethingOther").value.asBoolean.exists, false);
});

Deno.test(".value.asBoolean.orDefault", () => {
  assertEquals(config.get("someString").value.asBoolean.orDefault(false), true);
  assertEquals(config.get("someNumber").value.asBoolean.orDefault(false), true);
  assertEquals(config.get("someNested").value.asBoolean.orDefault(false), true);
  assertEquals(config.get("thruthy").value.asBoolean.orDefault(false), true);
  assertEquals(config.get("falsy").value.asBoolean.orDefault(true), false);
  assertEquals(
    config.get("booleanStringTrue").value.asBoolean.orDefault(false),
    true,
  );
  assertEquals(
    config.get("booleanStringFalse").value.asBoolean.orDefault(true),
    false,
  );

  // non-sxists
  assertEquals(
    config.get("somethingOther").value.asBoolean.orDefault(true),
    true,
  );
  assertEquals(
    config.get("somethingOther").value.asBoolean.orDefault(false),
    false,
  );
});

Deno.test(".value.asBoolean.nullable", () => {
  assertEquals(config.get("falsy").value.asBoolean.nullable, false);
  assertEquals(config.get("somethingOther").value.asBoolean.nullable, null);
});

Deno.test(".value.asBoolean.orThrow", () => {
  assertEquals(config.get("thruthy").value.asBoolean.orThrow, true);
  assertThrows(
    () => config.get("somethingOther").value.asBoolean.orThrow,
    ConfigurationException,
  );
});
