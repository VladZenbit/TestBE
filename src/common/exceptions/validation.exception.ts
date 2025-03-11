import type { HttpException } from '@nestjs/common';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

const validationPipe = new ValidationPipe();
const exceptionFactory = validationPipe.createExceptionFactory() as (
  errors: ValidationError[],
) => HttpException;

export class ValidationException extends BadRequestException {
  constructor(validationErrors: ValidationError[]) {
    super(exceptionFactory(validationErrors).getResponse(), {
      cause: validationErrors,
    });
  }
}

export const validationBadRequestExceptionSample = new ValidationException([
  plainToInstance<ValidationError, ValidationError>(ValidationError, {
    property: 'email',
    value: 'john.wick@example.com',
    constraints: {
      email: 'must be a valid email',
    },
  }),
]);
