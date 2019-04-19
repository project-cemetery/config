# @solid-soda/config

Provides several classes to help you find, load, combine, autofill and validate configuration values of any kind

## Instalation

`yarn add @solid-soda/config`

## Basics

Any configuration implements `Configuration` interface.

> `@solid-soda/config` uses [tsoption](add_link) for nullable values

```js
import { Option } from 'tsoption'

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

  isDev(): boolean
  isProd(): boolean
}
```

## Load configs

Library provides some classes for comfortable loading configs from different sources.

#### DotEnvConfiguration

It uses `.env` file to load configuration. Build over great [dotenv](add_link) lib.

Example:
```js
import { DotEnvConfiguration } from '@solid-soda/config'

const config = new DotEnvConfiguration('./configs/.env')
```

#### EnvConfiguraton

It uses `process.env` to load configuration.

Example:
```js
import { EnvConfiguration } from '@solid-soda/config'

const config = new EnvConfiguration()
```

#### ExternalConfiguration

It uses plain object for configuration source.

```js
import { ExternalConfiguration } from '@solid-soda/config'

const config = new ExternalConfiguration({
  apiToken: 'jkfdshfk323.fjkhdksf.aodsa34',
  applySecurity: true,
})
```

#### FileConfiguration

It loads any file as configuration. You must pass `fileParse` as second argument to parse file.

```js
import { FileConfiguration, jsonParse } from '@solid-soda/config'

const config = new FileConfiguration('./configs/params.json', jsonParse)
```

##### Available parsers

+ `jsonParse`

Also you can create the custom parser. It must be a function `(file: stirng) => ConfigDict`, where ConfigDict is object with string keys and string or undefined values.

### Custom configuration

Of course, you can create the custom Configuration. Just implement `Configuration` interface and use it.

Also, you can extend helper class `AbstractConfiguration` and implement only `get` and `isDev` methods.

The following configuration has no any values and always returns empty `Option`.
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


## Real world example

In example app we want use `DotEnvConfiguration` in dev environment and `EnvConfiguraton` in production. Just create the simple factory function:

```js
import { DotEnvConfiguration, EnvConfiguraton } from '@solid-soda/config'

function isDev() {
  return process.env.NODE_ENV === 'development'
}

export const getConfig = () => {
  if (isDev()) {
    return new DotEnvConfiguration('../.env')
  }

  return new EnvConfiguraton()
}
```

That is all. We can use `getConfig` in any place of our application, or pass the result to DI container, or something else.
