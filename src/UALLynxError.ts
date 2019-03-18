import { UALError, UALErrorType } from '@blockone/universal-authenticator-library'
import { Name } from './interfaces'

export class UALLynxError extends UALError {
  constructor(message: string, type: UALErrorType, cause: Error | null) {
    super(message, type, cause, Name)
  }
}
