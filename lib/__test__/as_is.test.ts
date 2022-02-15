import { assertEquals } from "https://deno.land/std@0.100.0/testing/asserts.ts";

import { createConfiguration } from "../create.ts";

const config = createConfiguration({
  someString: "value",
  someNumber: 1,
  someNested: { value: 1 },
  someBoolean: true,
  booleanString: "true",
});

Deno.test(".asIs", () => {
  assertEquals(config.get("someString").asIs, "value");
  assertEquals(config.get("someNumber").asIs, 1);
  assertEquals(config.get("someNested").asIs, { value: 1 });
  assertEquals(config.get("someBoolean").asIs, true);
  assertEquals(config.get("booleanString").asIs, "true");

  assertEquals(config.get("somethingOther").asIs, undefined);
});
