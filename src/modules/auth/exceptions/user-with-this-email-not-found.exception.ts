import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export class UserWithThisEmailNotFoundException extends NotFoundException {
  constructor(email: string, options?: HttpExceptionOptions) {
    super(`User with ${email} not found`, options);
  }
}

export const userWithEmailNotFoundExceptionSample =
  new UserWithThisEmailNotFoundException('test@gmail.com');
