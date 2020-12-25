import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { ERROR_SEPARATOR } from './constants';

export function isEmpty(value: any): boolean {
  return Object.keys(value).length <= 0;
}

export function formatErrors(errors: ValidationError[]): string {
  return errors
    .map(error => {
      if (error.constraints) {
        for (const property in error.constraints) {
          if (error.constraints.hasOwnProperty(property)) {
            return error.constraints[property];
          }
        }
      }
      if (error.children) {
        return this.formatErrors(error.children);
      }
    })
    .join(ERROR_SEPARATOR);
}

export function isPrimitiveType(metatype: any): boolean {
  const types = [String, Boolean, Number, Array, Object];

  return types.includes(metatype);
}

export function handleErrorMessage(httpStatus: HttpStatus, errorMessage: any, authInfo: any): string[] {
  const message: string = errorMessage.message || errorMessage.error || errorMessage || 'Unknown error.';
  return message.split(ERROR_SEPARATOR).map(msg => getMessage(httpStatus, msg, authInfo));
}

function getMessage(httpStatus: HttpStatus, errorMessage: any, authInfo: any): string {
  switch (httpStatus) {
    case HttpStatus.UNAUTHORIZED:
      if (authInfo && authInfo['name'] === 'TokenExpiredError') {
        return 'Token has expired.';
      }
      return errorMessage.errorMessage === 'Unauthorized' ? 'Unauthorized.' : errorMessage;
    case HttpStatus.FORBIDDEN:
      return errorMessage.errorMessage === 'Forbidden' ? 'Forbidden.' : errorMessage;
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'An internal error has ocurred.';
    default:
      return errorMessage;
  }
}
