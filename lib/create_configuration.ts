/* eslint-disable prefer-const */

import {
  Shape,
  Configuration,
  ConfigEntry,
  UnknownPrimitiveEntry,
  PrimitiveConfigEntry,
  UnknownArrayConfigEntry,
} from './types';

function createEntry<T>(
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

function checkEmpty(value: unknown) {
  return typeof value === 'undefined' || value === null || value === '';
}

export function createConfiguration(
  record: Record<string, unknown>,
): Configuration {
  function getValueEntry(key: string): UnknownPrimitiveEntry {
    return {
      get asBoolean(): PrimitiveConfigEntry<boolean> {
        return createEntry(
          record[key],
          (value) => {
            if (value === 'false') {
              return false;
            }

            if (Number(value) === 0) {
              return false;
            }

            return Boolean(value);
          },
          checkEmpty,
        );
      },
      // TODO: TEST
      get asDate(): PrimitiveConfigEntry<Date> {
        return createEntry(
          record[key],
          (value) => new Date(value as any),
          (value, dateValue) =>
            checkEmpty(value) || Number.isNaN(dateValue.valueOf()),
        );
      },
      // TODO: TEST
      get asNumber(): PrimitiveConfigEntry<Number> {
        return createEntry(
          record[key],
          Number,
          (value, numbericValue) =>
            checkEmpty(value) || Number.isNaN(numbericValue),
        );
      },
      // TODO: TEST
      get asString(): any {
        return createEntry(record[key], String, checkEmpty);
      },
    };
  }

  function getConfigByKey(key: string): ConfigEntry {
    return {
      get asIs(): unknown {
        return record[key];
      },
      get value(): UnknownPrimitiveEntry {
        return getValueEntry(key);
      },
      // TODO: write
      get asArray(): UnknownArrayConfigEntry {
        return {} as any;
      },
    };
  }

  const env = getConfigByKey('NODE_ENV').value.asString.orDefault(
    'development',
  );

  return {
    key: getConfigByKey,
    // TODO: write
    shape: (_: any) => {
      return {} as any;
    },
    // TODO: TEST
    get isDev() {
      return env === 'development';
    },
    // TODO: TEST
    get isProd() {
      return env === 'production';
    },
  };
}
