/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */

import {
  Shape,
  Configuration,
  ConfigurationGetter,
  ConfigEntry,
  UnknownPrimitiveEntry,
  PrimitiveConfigEntry,
  ArrayConfigEntry,
  UnknownArrayConfigEntry,
} from './types';

function createPrimitiveEntry<T>(
  rawValue: unknown,
  customMapper: (value: unknown) => T,
  isEmpty: (rawValue: unknown, parsedValue: T) => boolean,
): PrimitiveConfigEntry<T> {
  const parsedValue = customMapper(rawValue);

  const shouldSkipValue = isEmpty(rawValue, parsedValue);

  return {
    get exists() {
      return !shouldSkipValue;
    },
    orDefault(def: T) {
      return shouldSkipValue ? def : parsedValue;
    },
    get nullable() {
      return shouldSkipValue ? null : parsedValue;
    },
    get orThrow() {
      if (shouldSkipValue) {
        throw new Error('SHIT');
      }

      return parsedValue;
    },
  };
}

function createArrayEntry<T>(
  rawValue: unknown,
  customMapper: (value: unknown) => T,
  isEmpty: (rawValue: unknown, parsedValue: T) => boolean,
): ArrayConfigEntry<T> {
  let parsedValue: T[] = [];

  if (Array.isArray(rawValue)) {
    parsedValue = rawValue.map(customMapper);
  } else if (typeof rawValue === 'string' && rawValue.includes(',')) {
    parsedValue = rawValue.split(',').map(customMapper);
  } else if (typeof rawValue === 'string' && rawValue.includes(';')) {
    parsedValue = rawValue.split(';').map(customMapper);
  } else if (typeof rawValue === 'string') {
    parsedValue = [customMapper(rawValue)];
  }

  parsedValue = parsedValue.filter((value) => !isEmpty(rawValue, value));

  const shouldSkipValue = parsedValue.length === 0;

  return {
    get orThrow() {
      if (shouldSkipValue) {
        throw new Error('hati');
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
  return typeof value === 'undefined' || value === null || value === '';
}

function checkEmptyDate(value: unknown, dateValue: Date) {
  return checkEmpty(value) || Number.isNaN(dateValue.valueOf());
}

function checkEmptyNumber(value: unknown, numericValue: number) {
  return checkEmpty(value) || Number.isNaN(numericValue);
}

function toBoolean(value: unknown): boolean {
  if (value === 'false') {
    return false;
  }

  if (Number(value) === 0) {
    return false;
  }

  return Boolean(value);
}

function toDate(value: unknown) {
  return new Date(value as any);
}

function toNumber(value: unknown) {
  return Number(value);
}

function toString(value: unknown) {
  return String(value);
}

export function createConfiguration(
  record: Record<string, unknown>,
): Configuration {
  const getConfigShape: Shape = (callback) =>
    callback(
      new Proxy(
        {},
        {
          get: (_1, prop, _2) => getConfigByKey(prop as any),
        },
      ),
    );

  function getConfigByKey(key: string): ConfigEntry {
    return {
      get asIs(): unknown {
        return record[key];
      },
      get value(): UnknownPrimitiveEntry {
        return {
          get asBoolean(): PrimitiveConfigEntry<boolean> {
            return createPrimitiveEntry(record[key], toBoolean, checkEmpty);
          },
          get asDate(): PrimitiveConfigEntry<Date> {
            return createPrimitiveEntry(record[key], toDate, checkEmptyDate);
          },
          get asNumber(): PrimitiveConfigEntry<number> {
            return createPrimitiveEntry(
              record[key],
              toNumber,
              checkEmptyNumber,
            );
          },
          get asString(): any {
            return createPrimitiveEntry(record[key], toString, checkEmpty);
          },
        };
      },
      get asArray(): UnknownArrayConfigEntry {
        return {
          get ofNumber() {
            return createArrayEntry(record[key], toNumber, checkEmptyNumber);
          },
          get ofBoolean() {
            return createArrayEntry(record[key], toBoolean, checkEmpty);
          },
          get ofDate() {
            return createArrayEntry(record[key], toDate, checkEmptyDate);
          },
          get ofString() {
            return createArrayEntry(record[key], toString, checkEmpty);
          },
        };
      },
      get asNested(): ConfigurationGetter {
        return {
          key: (nestedKey) =>
            createConfiguration(getConfigByKey(key).asIs as any).key(nestedKey),
          shape: (config) =>
            createConfiguration(getConfigByKey(key).asIs as any).shape(config),
        };
      },
    };
  }

  const env = getConfigByKey('NODE_ENV').value.asString.orDefault(
    'development',
  );

  return {
    key: getConfigByKey,
    shape: getConfigShape,
    get isDev() {
      return env === 'development';
    },
    get isProd() {
      return env === 'production';
    },
  };
}
