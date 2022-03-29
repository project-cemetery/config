import { assertEquals } from "https://deno.land/std@0.100.0/testing/asserts.ts";

import { mergeConfigurations } from "../merge.ts";
import { createConfiguration } from "../create.ts";

Deno.test("merge two config with records", () => {
  const first = createConfiguration({ first: 1 });
  const second = createConfiguration({ second: 2 });

  const merged = mergeConfigurations(first, second);

  assertEquals(merged.get("first").value.asNumber.nullable, 1);
  assertEquals(merged.get("second").value.asNumber.nullable, 2);
});

Deno.test("merge two config with callbacks", () => {
  const first = createConfiguration((key) => ({ first: 1 }[key]));
  const second = createConfiguration((key) => ({ second: 2 }[key]));

  const merged = mergeConfigurations(first, second);

  assertEquals(merged.get("first").value.asNumber.nullable, 1);
  assertEquals(merged.get("second").value.asNumber.nullable, 2);
});

Deno.test("merge two configs with same keys", () => {
  const first = createConfiguration({ first: 1 });
  const second = createConfiguration({ first: 2 });

  const merged = mergeConfigurations(first, second);

  assertEquals(merged.get("first").value.asNumber.nullable, 1);
});
