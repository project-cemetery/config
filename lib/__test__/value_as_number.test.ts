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
});

Deno.test(".value.asNumber.exists", () => {
  // exists
  assertEquals(config.get("someNumber").value.asNumber.exists, true);
  assertEquals(config.get("thruthy").value.asNumber.exists, true);
  assertEquals(config.get("falsy").value.asNumber.exists, true);
  assertEquals(config.get("someString").value.asNumber.exists, false);
  assertEquals(config.get("someNested").value.asNumber.exists, false);

  // non-sxists
  assertEquals(config.get("somethingOther").value.asNumber.exists, false);
});

Deno.test(".value.asNumber.orDefault", () => {
  assertEquals(config.get("someNumber").value.asNumber.orDefault(1337), 1);
  assertEquals(config.get("thruthy").value.asNumber.orDefault(1337), 1);
  assertEquals(config.get("falsy").value.asNumber.orDefault(1337), 0);
  assertEquals(config.get("someString").value.asNumber.orDefault(1337), 1337);
  assertEquals(config.get("someNested").value.asNumber.orDefault(1337), 1337);

  // non-sxists
  assertEquals(
    config.get("somethingOther").value.asNumber.orDefault(13371),
    13371,
  );
  assertEquals(
    config.get("somethingOther").value.asNumber.orDefault(13372),
    13372,
  );
});

Deno.test(".value.asNumber.nullable", () => {
  assertEquals(config.get("someNumber").value.asNumber.nullable, 1);
  assertEquals(config.get("someString").value.asNumber.nullable, null);
  assertEquals(config.get("somethingOther").value.asNumber.nullable, null);
});

Deno.test(".value.asNumber.orThrow", () => {
  assertEquals(config.get("someNumber").value.asNumber.orThrow, 1);
  assertThrows(
    () => config.get("someString").value.asNumber.orThrow,
    ConfigurationException,
  );
  assertThrows(
    () => config.get("somethingOther").value.asNumber.orThrow,
    ConfigurationException,
  );
});
