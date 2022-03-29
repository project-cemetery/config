# denfig

Simple and powerful solution for managing configuration for Deno applications.
It allows you to parse, validate and transform various formats of configuration.

> This package is suitable only for Deno since v3 release. If you want to use it
> with Node.js consider using
> [v2](https://github.com/igorkamyshev/denfig/tree/v2-node).

## Installation

```ts
// Import from Deno's third party module registry
import { createEnvConfiguration } from "https://deno.land/x/denfig@3.0.0/lib.ts";

// Import from GitHub
import { createEnvConfiguration } from "https://raw.githubusercontent.com/igorkamyshev/denfig/3.0.0/lib.ts";
```

## Usage

### Environment configuration

In common case, application gets configuration from environment variables thru
`Deno.env` calls, you can hide this detail:

```ts
import { createEnvConfiguration } from "https://deno.land/x/denfig@3.0.0/lib.ts";

// config is using environment variables as a source of true
const config = createEnvConfiguration();
```

### Abstract configuration

You can use you own configuration provider:

```ts
import { createConfiguration } from "https://deno.land/x/denfig@3.0.0/lib.ts";

// config is using argument dictionary as a source of true
const configFromDictionary = createConfiguration({ REDIS_PASSWORD: "qwerty" });

// config will call callback with particular key for each configuration piece
const configFromDictionary = createConfiguration((key: string) => {
  // ...
  return null;
});
```

### Configuration API

Any factory creates a single `Configuration` object that can be used for
parsing, validating and manipulating configuration.

#### `.get(key).value`

You can extract single piece of config by particular key with this method:

```ts
const entry = config.get("PORT").value;
```

It returns `UnknownPrimitiveEntry` that can be parsed in many ways:

- `.asNumebr` contains `PrimitiveConfigEntry` with `number`;
- `.asString` contains `PrimitiveConfigEntry` with `string`;
- `.asBoolean` contains `PrimitiveConfigEntry` with `boolean`;
- `.asDate`contains`PrimitiveConfigEntry` with `Date`.

You can cast any `PrimitiveConfigEntry` to primitive value by one of the next
methods:

- `.exists` returns `true` for non-empty entry and returns `false` for empty
  entry;
- `.orDefault(def)` returns entry and uses default value in case of absent
  entry;
- `.nullable` returns entry or `null` in case of absent entry;
- `.orThrow` returns entry or throws `ConfigurationExceptions` in case of absent
  entry;

Example:

```ts
const config = createConfiguration({ PORT: "8080" });

// appPort's value is 8080, it has type "number"
const appPort = config.get("PORT").value.asNumber.orDefault(4000);
```

#### `.get(key).asArray`

You can extract many pieces of config by particular key with this method:

```ts
const entry = config.get("PORT").asArray;
```

It returns `UnknownArrayConfigEntry` that can be parsed in many ways:

- `.ofNumebr` contains `ArrayConfigEntry` with array of `number`;
- `.ofString` contains `ArrayConfigEntry` with array of `string`;
- `.ofBoolean` contains `ArrayConfigEntry` with array of `boolean`;
- `.ofDate` contains `ArrayConfigEntry` with array of `Date`.

You can cast any `ArrayConfigEntry` to array of primitive values by one of the
next methods:

- `.exists` returns `true` for non-empty entry and returns `false` for empty
  entry;
- `.orEmpty` returns array of entries or empty array;
- `.nullable` returns array of entries or `null` in case of absent entries;
- `.orThrow` returns enarray of entries or throws `ConfigurationExceptions` in
  case of absent entries;

> `ArrayConfigEntry` will parse a string divided by commas and semicolons.

Example:

```ts
const config = createConfiguration({
  KAFKA_BROKERS: "br.kafka1.int:8080,br.kafka2.int:8080,br.kafka3.int:8080",
});

// brokers's value is ["br.kafka1.int:8080", "br.kafka2.int:8080", "br.kafka3.int:8080"]
const brokers = config.get("KAFKA_BROKERS").asArray.ofString.orEmpty;
```

#### `.get(key).asNested`

You can extract sub-tree of configuration tree by particular key with this
method:

```ts
cosnt config = createConfiguration({ redig: { password: 'qwerty', port: 1337 }});

const redisConfig = config.get('redis').asNested;
```

It returns plain `Configuration`-object with subset of entries.

#### `.shape(callback)`

You can create an object with all required pieces of configuration by one call:

```ts
const { appPort, redisPassword, telegramKey, kafkaBrokers } = config.shape(
  // each field of callback argument contains result of `.get(key)` call
  ({ PORT, REDIS_PASSWORD, TELEGRAM_KEY, KAFKA_BROKERS }) => ({
    appPort: PORT.value.asNumber.orDefault(4000),
    redisPassword: REDIS_PASSWORD.value.asString.orThrow,
    telegramKey: TELEGRAM_KEY.value.asString.orThrow,
    kafkaBrokers: KAFKA_BROKERS.asArray.ofString.orEmpty,
  }),
);
```

It can be used for validation app configuration. This method will throw
`ShapeConfigurationError` if one of shape's members will throw
`ConfigurationError`.

### Configuration merge

You can merge any amount of configs:

```ts
const firstConfig = createEnvConfiguration();
const secondConfig = createConfiguration({ IS_DEV: false });

// It contains all variables from environment variables from firstConfig
// and additional params from secondConfig
const config = mergeConfigurations(firstConfig, secondConfig);
```
