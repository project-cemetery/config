export class ParameterNotFound extends Error {
  public constructor(name: string) {
    super(`Parameter "${name}" not found`)
  }
}
