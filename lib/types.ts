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
  mapper: (config: { [key in string]: ConfigEntry }) => T
) => T;

export interface ConfigurationGetter {
  get(key: string): ConfigEntry;
  shape: Shape;
}

export type Configuration = ConfigurationGetter;

export interface ConfigEntry {
  value: UnknownPrimitiveEntry;
  asArray: UnknownArrayConfigEntry;
  asIs: unknown;
  asNested: ConfigurationGetter;
}

export interface UnknownPrimitiveEntry {
  asBoolean: PrimitiveConfigEntry<boolean>;
  asDate: PrimitiveConfigEntry<Date>;
  asNumber: PrimitiveConfigEntry<number>;
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
  ofNumber: ArrayConfigEntry<number>;
  ofString: ArrayConfigEntry<string>;
}

export interface ArrayConfigEntry<T> {
  exists: boolean;
  orThrow: T[];
  orEmpty: T[];
  nullable: T[] | null;
}
