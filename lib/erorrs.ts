export class ShapeConfigurationException extends Error {
  constructor(readonly errors: ConfigurationException[] = []) {
    super("Shape failed");
  }
}

export class ConfigurationException extends Error {}
