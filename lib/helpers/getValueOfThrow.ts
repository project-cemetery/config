import { Option } from 'tsoption'

import { ParameterNotFound } from '../exceptions/ParameterNotFound'

export const getValueOrThrow = <T>(name: string, option: Option<T>): T => {
  if (option.nonEmpty()) {
    return option.get()
  }

  throw new ParameterNotFound(name)
}
