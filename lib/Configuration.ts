import { Option } from 'nanoption';

export abstract class Configuration {
  abstract get(key: string): Option<string>;

  abstract getString(key: string): Option<string>;

  abstract getNumber(key: string): Option<number>;

  abstract getBoolean(key: string): Option<boolean>;

  abstract getDate(key: string): Option<Date>;

  abstract getOrElse(key: string, or: string): string;

  abstract getStringOrElse(key: string, or: string): string;

  abstract getNumberOrElse(key: string, or: number): number;

  abstract getBooleanOrElse(key: string, or: boolean): boolean;

  abstract getDateOrElse(key: string, or: Date): Date;

  abstract getOrThrow(key: string): string;

  abstract getStringOrThrow(key: string): string;

  abstract getNumberOrThrow(key: string): number;

  abstract getBooleanOrThrow(key: string): boolean;

  abstract getDateOrThrow(key: string): Date;

  abstract isDev(): boolean;

  abstract isProd(): boolean;
}
