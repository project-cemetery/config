export type Shape = <
  T extends Record<
    string,
    | string
    | Date
    | boolean
    | number
    | null
    | Array<string>
    | Array<Date>
    | Array<boolean>
    | Array<number>
  >
>(
  mapper: (config: { [key in string]: ConfigEntry }) => T,
) => T;

export interface Configuration {
  key(key: string): ConfigEntry;
  shape: Shape;

  isDev: boolean;
  isProd: boolean;
}

export interface ConfigEntry {
  value: UnknownPrimitiveEntry;
  asArray: UnknownArrayConfigEntry;
  asIs: unknown;
}

export interface UnknownPrimitiveEntry {
  asBoolean: PrimitiveConfigEntry<boolean>;
  asDate: PrimitiveConfigEntry<Date>;
  asNumber: PrimitiveConfigEntry<Number>;
  asString: PrimitiveConfigEntry<string>;
}

export interface PrimitiveConfigEntry<T> {
  exists: boolean;

  orDefault(def: T): T;
  nullable: T | null;
  orThrow: T;
}

export interface UnknownArrayConfigEntry {
  ofBoolean: ArrayConfigEntry<boolean>;
  ofDate: ArrayConfigEntry<Date>;
  ofNumber: ArrayConfigEntry<Number>;
  ofString: ArrayConfigEntry<string>;
}

export interface ArrayConfigEntry<T> {
  orThrow: T[];
  orEmpty: T[];
  nullable: T[] | null;
}
