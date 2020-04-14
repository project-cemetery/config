import * as fs from 'fs';

import { ParseFile } from './ParseFile';
import { ParsingFailedException } from './ParsingFailedException';

const acceptedValueTypes = ['number', 'boolean', 'string', 'undefined'];

export const jsonParse: ParseFile = (filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath).toString());

  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new ParsingFailedException(filePath, 'json must contain only object');
  }

  Object.entries(data).forEach(([key, value]) => {
    if (!acceptedValueTypes.includes(typeof value)) {
      throw new ParsingFailedException(
        filePath,
        `values must be one of foolowing types ${acceptedValueTypes.join(
          ', ',
        )}`,
        key,
      );
    }
  });

  return data;
};
