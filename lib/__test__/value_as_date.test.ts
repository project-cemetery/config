import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.100.0/testing/asserts.ts";

import { createConfiguration } from "../create.ts";
import { ConfigurationException } from "../erorrs.ts";

const config = createConfiguration({
  someString: "value",
  someNumber: 1,
  someISODate: "2022-02-14T14:48:32.439Z",
  someNested: { value: 1 },
  thruthy: true,
  falsy: false,
});

Deno.test(".value.asDate.exists", () => {
  // exists
  assertEquals(config.get("someNumber").value.asDate.exists, true);
  assertEquals(config.get("someISODate").value.asDate.exists, true);

  assertEquals(config.get("thruthy").value.asDate.exists, false);
  assertEquals(config.get("falsy").value.asDate.exists, false);
  assertEquals(config.get("someString").value.asDate.exists, false);
  assertEquals(config.get("someNested").value.asDate.exists, false);

  // non-sxists
  assertEquals(config.get("somethingOther").value.asDate.exists, false);
});

Deno.test(".value.asDate.orDefault", () => {
  const defDate1 = new Date("2022-02-14");
  const defDate2 = new Date("2022-02-14");

  assertEquals(
    config.get("someISODate").value.asDate.orDefault(defDate1),
    new Date("2022-02-14T14:48:32.439Z"),
  );
  assertEquals(
    config.get("someNumber").value.asDate.orDefault(defDate1),
    new Date(1),
  );

  assertEquals(
    config.get("thruthy").value.asDate.orDefault(defDate1),
    defDate1,
  );
  assertEquals(config.get("falsy").value.asDate.orDefault(defDate1), defDate1);
  assertEquals(
    config.get("someString").value.asDate.orDefault(defDate1),
    defDate1,
  );
  assertEquals(
    config.get("someNested").value.asDate.orDefault(defDate1),
    defDate1,
  );

  // non-sxists
  assertEquals(
    config.get("somethingOther").value.asDate.orDefault(defDate1),
    defDate1,
  );
  assertEquals(
    config.get("somethingOther").value.asDate.orDefault(defDate2),
    defDate2,
  );
});

Deno.test(".value.asDate.nullable", () => {
  assertEquals(
    config.get("someISODate").value.asDate.nullable,
    new Date("2022-02-14T14:48:32.439Z"),
  );
  assertEquals(config.get("someNumber").value.asDate.nullable, new Date(1));

  assertEquals(config.get("someString").value.asDate.nullable, null);
  assertEquals(config.get("somethingOther").value.asDate.nullable, null);
});

Deno.test(".value.asDate.orThrow", () => {
  assertEquals(
    config.get("someISODate").value.asDate.orThrow,
    new Date("2022-02-14T14:48:32.439Z"),
  );
  assertEquals(config.get("someNumber").value.asDate.orThrow, new Date(1));

  assertThrows(
    () => config.get("someString").value.asDate.orThrow,
    ConfigurationException,
  );
  assertThrows(
    () => config.get("somethingOther").value.asDate.orThrow,
    ConfigurationException,
  );
});
