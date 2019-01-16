export default class ParsingFailedException extends Error {
  public readonly filePath: string

  public constructor(filePath: string, message?: string, failedKey?: string) {
    let fullMessage = `Parsing file "${filePath}" failed with message: ${message}`

    if (failedKey) {
      fullMessage = `${fullMessage} on key "${failedKey}"`
    }

    super(fullMessage)
    this.filePath = filePath
  }
}
