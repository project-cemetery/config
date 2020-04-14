import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { ParseFile } from './ParseFile';

export const dotEnvParse: ParseFile = (filePath) =>
  dotenv.parse(fs.readFileSync(filePath));
