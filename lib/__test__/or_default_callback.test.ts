import { assertEquals } from "https://deno.land/std@0.100.0/testing/asserts.ts";
import { assertSpyCalls, spy } from "https://deno.land/x/mock@0.13.0/mod.ts";

import { createConfiguration } from "../create_configuration.ts";

const config = createConfiguration({
  someString: "value",
  someNumber: 1,
  someNested: { value: 1 },
  thruthy: true,
  falsy: false,
});

Deno.test(".value.asString.orDefault with callback", () => {
  const getDefault = spy(() => "spy_default");

  assertEquals(
    config.get("someString").value.asString.orDefault(getDefault),
    "value",
  );
  assertSpyCalls(getDefault, 0);

  assertEquals(
    config.get("someOtherKey").value.asString.orDefault(getDefault),
    "spy_default",
  );
  assertSpyCalls(getDefault, 1);
});
