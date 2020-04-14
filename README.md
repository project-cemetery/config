# @solid-soda/config

[![Scripts sets up by @solid-soda/scripts v2.1.0](https://img.shields.io/static/v1?label=@solid-soda/scripts&message=2.1.0&color=75ddf4)](https://github.com/solid-soda/scripts)

Provides several classes to help you find, load, combine, autofill and validate configuration values of any kind.

Why this library:

- simple way to configure application
- don't read or rewrite global object (like `process.env`) in an app
- different configs for different environments
- friendly for DI containers

## Installation

`yarn add @solid-soda/config`

## TL;DR

In example app we want to use `DotEnvConfiguration` in dev environment and `EnvConfiguraton` in production. Just create a simple factory function:

```js
import { CommonConfiguraton } from '@solid-soda/config';

export const config = new CommonConfiguraton('../.env');
```

That is all. We can use `config` in any place of our application, or pass the result to DI container, etc. It uses `DotEnvConfiguration` in dev-mode and `EnvConfiguration` in prod-mode.

```js
import { config } from './config';

const secret = config.getOrElse('APP_SECRET', 'DefaultSecret');
```

## Basics

Every configuration implements `Configuration` interface.

> `@solid-soda/config` uses [nanoption](https://github.com/igorkamyshev/nanoption) for nullable values

```js
import { Option } from 'nanoption'

interface Configuration {
  get(key: string): Option<string>
  getString(key: string): Option<string>
  getNumber(key: string): Option<number>
  getBoolean(key: string): Option<boolean>
  getDate(key: string): Option<Date>

  getOrElse(key: string, or: string): string
  getStringOrElse(key: string, or: string): string
  getNumberOrElse(key: string, or: number): number
  getBooleanOrElse(key: string, or: boolean): boolean
  getDateOrElse(key: string, or: Date): Date

  getOrThrow(key: string): string
  getStringOrThrow(key: string): string
  getNumberOrThrow(key: string): number
  getBooleanOrThrow(key: string): boolean
  getDateOrThrow(key: string): Date

  isDev(): boolean
  isProd(): boolean
}
```

Method `*OrThrow` throws `ParameterNotFound` exception, if a value for the provided key is empty.

## Load configs

Library provides classes for comfortable loading of configs from different sources.

#### CommonConfiguration

uses `.env` file in dev-mode and `process.env` in prod-mode. Built over `DotEnvConfiguration` and `EnvConfiguraton`.

Example:

```js
import { CommonConfiguration } from '@solid-soda/config';

// pass .env file path for dev-mode, in prod-mode will be ignored
const config = new CommonConfiguration('./configs/.env');
```

#### DotEnvConfiguration

uses `.env` file to load configuration. Built over great [dotenv](https://github.com/motdotla/dotenv) lib.

Example:

```js
import { DotEnvConfiguration } from '@solid-soda/config';

const config = new DotEnvConfiguration('./configs/.env');
```

#### EnvConfiguraton

uses `process.env` to load configuration.

Example:

```js
import { EnvConfiguration } from '@solid-soda/config';

const config = new EnvConfiguration();
```

#### ExternalConfiguration

uses plain object as configuration source.

```js
import { ExternalConfiguration } from '@solid-soda/config';

const config = new ExternalConfiguration({
  apiToken: 'jkfdshfk323.fjkhdksf.aodsa34',
  applySecurity: true,
});
```

#### FileConfiguration

can accept any file as configuration. You must pass `fileParse` as second argument to parse file.

```js
import { FileConfiguration, jsonParse } from '@solid-soda/config';

const config = new FileConfiguration('./configs/params.json', jsonParse);
```

##### Available parsers

- `jsonParse`

Also you can create the custom parser. It must be a function `(file: stirng) => ConfigDict`, where `ConfigDict` is object with string keys and string or undefined values.

### Custom configuration

Of course, you can create the custom Configuration. Just implement `Configuration` interface and use it.

Also, you can extend helper class `AbstractConfiguration` and implement only `get` and `isDev` methods.

The following configuration has no values and always returns empty `Option`.

```js

import { AbstractConfiguration } from '@solid-soda/config'

class NeverConfiguration extends AbstractConfiguration {
  public get = (key: string) => Option.of(null)

  public isDev = () => true
}
```

## Combine configs

Work in progress

## Validate configs

Work in progress

## Autofill configs

Work in progress
