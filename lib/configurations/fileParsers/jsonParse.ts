import * as fs from 'fs'

import FileParser from './ParseFile'
import ParsingFailedException from './ParsingFailedException'

const acceptedValueTypes = ['number', 'boolean', 'string', 'undefined']

const isArray = (data: any) =>
  ['map', 'filter'].every(method => typeof data[method] !== 'undefined')

const jsonParse: FileParser = filePath => {
  const data = JSON.parse(fs.readFileSync(filePath).toString())

  if (typeof data !== 'object' || isArray(data)) {
    throw new ParsingFailedException(filePath, 'json must contain only object')
  }

  Object.entries(data).forEach(([key, value]) => {
    if (!acceptedValueTypes.includes(typeof value)) {
      throw new ParsingFailedException(
        filePath,
        `values must be one of foolowing types ${acceptedValueTypes.join(
          ', ',
        )}`,
        key,
      )
    }
  })

  return data
}

export default jsonParse
