import type { HttpExceptionOptions } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

export class EmailOrPasswordIsNotValidException extends UnauthorizedException {
  constructor(options?: HttpExceptionOptions) {
    super(`Email or password is not valid`, options);
  }
}
