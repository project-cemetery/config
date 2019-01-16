import * as path from 'path'

import jsonParse from '../jsonParse'
import ParsingFailedException from '../ParsingFailedException'

const getPath = (filename: string) =>
  path.resolve(__dirname, './examples/', filename)

// tslint:disable:no-string-literal

describe('jsonParse', () => {
  test('should be parse flat json', () => {
    const dict = jsonParse(getPath('flat.json'))

    expect(dict['count']).toBe(12)
    expect(dict['allow']).toBeTruthy()
    expect(dict['appEnv']).toBe('production')
  })

  test('shpuld throw error on array json', () => {
    expect(() => jsonParse(getPath('array.json'))).toThrow(
      ParsingFailedException,
    )
  })

  test('shpuld throw error on true json', () => {
    expect(() => jsonParse(getPath('true.json'))).toThrow(
      ParsingFailedException,
    )
  })

  test('shpuld throw error on deep json', () => {
    expect(() => jsonParse(getPath('deep.json'))).toThrow(
      ParsingFailedException,
    )
  })
})
