import type { HttpExceptionOptions } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';

export class UserWithEmailAlreadyExistException extends ConflictException {
  constructor(email: string, options?: HttpExceptionOptions) {
    super(`User with ${email} already exists`, options);
  }
}

export const userWithEmailAlreadyExistExceptionsSample =
  new UserWithEmailAlreadyExistException('test@gmail.com');
