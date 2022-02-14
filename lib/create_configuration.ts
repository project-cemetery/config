import {
  ArrayConfigEntry,
  ConfigEntry,
  Configuration,
  ConfigurationGetter,
  PrimitiveConfigEntry,
  Shape,
  UnknownArrayConfigEntry,
  UnknownPrimitiveEntry,
} from "./types.ts";
import {
  ConfigurationException,
  ShapeConfigurationException,
} from "./erorrs.ts";

type ValueGetter = (key: string) => unknown;
type ErrorHandler = (
  error: ConfigurationException | ShapeConfigurationException,
) => void;

export function createConfiguration(
  record: Record<string, unknown> | ValueGetter,
): Configuration {
  const getConfigShape: Shape = (callback) => {
    const errors: Array<ShapeConfigurationException | ConfigurationException> =
      [];

    const result = callback(
      new Proxy(
        {},
        {
          get: (_, prop, __) => {
            if (typeof prop === "symbol") {
              throw new Error("Logic error");
            }
            return getConfigByKey(prop, { onError: (err) => errors.push(err) });
          },
        },
      ),
    );

    if (errors.length > 0) {
      const flattenErrors: Array<ConfigurationException> = [];

      for (const err of errors) {
        if (err instanceof ShapeConfigurationException) {
          flattenErrors.push(...err.errors);
        } else {
          flattenErrors.push(err);
        }
      }

      throw new ShapeConfigurationException(flattenErrors);
    }

    return result;
  };

  let getter: ValueGetter;
  if (typeof record === "function") {
    getter = record;
  } else {
    getter = (key) => record[key];
  }

  function getConfigByKey(
    key: string,
    { onError }: { onError?: ErrorHandler },
  ): ConfigEntry {
    const value = getter(key);

    return {
      get asIs(): unknown {
        return value;
      },
      get value(): UnknownPrimitiveEntry {
        return {
          get asBoolean(): PrimitiveConfigEntry<boolean> {
            return createPrimitiveEntry({
              value,
              parse: toBoolean,
              isEmpty: checkEmpty,
              onError,
            });
          },
          get asDate(): PrimitiveConfigEntry<Date> {
            return createPrimitiveEntry({
              value,
              parse: toDate,
              isEmpty: checkEmptyDate,
              onError,
            });
          },
          get asNumber(): PrimitiveConfigEntry<number> {
            return createPrimitiveEntry({
              value,
              parse: toNumber,
              isEmpty: checkEmptyNumber,
              onError,
            });
          },
          get asString() {
            return createPrimitiveEntry({
              value,
              parse: toString,
              isEmpty: checkEmpty,
              onError,
            });
          },
        };
      },
      get asArray(): UnknownArrayConfigEntry {
        return {
          get ofNumber() {
            return createArrayEntry({
              value,
              parse: toNumber,
              isEmpty: checkEmptyNumber,
              onError,
            });
          },
          get ofBoolean() {
            return createArrayEntry({
              value,
              parse: toBoolean,
              isEmpty: checkEmpty,
              onError,
            });
          },
          get ofDate() {
            return createArrayEntry({
              value,
              parse: toDate,
              isEmpty: checkEmptyDate,
              onError,
            });
          },
          get ofString() {
            return createArrayEntry({
              value,
              parse: toString,
              isEmpty: checkEmpty,
              onError,
            });
          },
        };
      },
      get asNested(): ConfigurationGetter {
        // TODO: handle this case
        // deno-lint-ignore no-explicit-any
        const nestedConfig = getConfigByKey(key, { onError }).asIs as any;
        return {
          get: (nestedKey) => createConfiguration(nestedConfig).get(nestedKey),
          shape: (config) => createConfiguration(nestedConfig).shape(config),
        };
      },
    };
  }

  return {
    get(key: string) {
      return getConfigByKey(key, {});
    },
    shape: getConfigShape,
  };
}

function createPrimitiveEntry<T>({
  value,
  parse,
  isEmpty,
  onError,
}: {
  value: unknown;
  parse: (value: unknown) => T;
  isEmpty: (rawValue: unknown, parsedValue: T) => boolean;
  onError?: ErrorHandler;
}): PrimitiveConfigEntry<T> {
  const parsedValue = parse(value);

  const shouldSkipValue = isEmpty(value, parsedValue);

  return {
    get exists() {
      return !shouldSkipValue;
    },
    orDefault(def: T) {
      if (!shouldSkipValue) {
        return parsedValue;
      }

      if (typeof def === "function") {
        return def();
      }

      return def;
    },
    get nullable() {
      return shouldSkipValue ? null : parsedValue;
    },
    get orThrow() {
      if (shouldSkipValue) {
        const error = new ConfigurationException();

        if (onError) {
          onError(error);
        } else {
          throw error;
        }
      }

      return parsedValue;
    },
  };
}

function createArrayEntry<T>({
  value,
  parse,
  isEmpty,
  onError,
}: {
  value: unknown;
  parse: (value: unknown) => T;
  isEmpty: (rawValue: unknown, parsedValue: T) => boolean;
  onError?: ErrorHandler;
}): ArrayConfigEntry<T> {
  let parsedValue: T[] = [];

  if (Array.isArray(value)) {
    parsedValue = value.map(parse);
  } else if (typeof value === "string" && value.includes(",")) {
    parsedValue = value.split(",").map(parse);
  } else if (typeof value === "string" && value.includes(";")) {
    parsedValue = value.split(";").map(parse);
  } else if (typeof value === "string") {
    parsedValue = [parse(value)];
  }

  parsedValue = parsedValue.filter((value) => !isEmpty(value, value));

  const shouldSkipValue = parsedValue.length === 0;

  return {
    get exists() {
      return !shouldSkipValue;
    },
    get orThrow() {
      if (shouldSkipValue) {
        const error = new ConfigurationException();

        if (onError) {
          onError(error);
        } else {
          throw error;
        }
      }

      return parsedValue;
    },
    get orEmpty() {
      return parsedValue;
    },
    get nullable() {
      if (shouldSkipValue) {
        return null;
      }
      return parsedValue;
    },
  };
}

function checkEmpty(value: unknown) {
  return typeof value === "undefined" || value === null || value === "";
}

function checkEmptyDate(value: unknown, dateValue: Date) {
  return (
    checkEmpty(value) ||
    typeof value === "boolean" ||
    Number.isNaN(dateValue.valueOf())
  );
}

function checkEmptyNumber(value: unknown, numericValue: number) {
  return checkEmpty(value) || Number.isNaN(numericValue);
}

function toBoolean(value: unknown): boolean {
  if (value === "false") {
    return false;
  }

  if (Number(value) === 0) {
    return false;
  }

  return Boolean(value);
}

function toDate(value: unknown) {
  // It'llbe checked later
  // deno-lint-ignore no-explicit-any
  return new Date(value as any);
}

function toNumber(value: unknown) {
  return Number(value);
}

function toString(value: unknown) {
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
