import * as dotenv from 'dotenv'
import * as fs from 'fs'

import FileParser from './ParseFile'

const dotEnvParse: FileParser = filePath =>
  dotenv.parse(fs.readFileSync(filePath))

export default dotEnvParse
