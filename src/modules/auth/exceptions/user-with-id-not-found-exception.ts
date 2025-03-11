import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export class UserWithIdNotFoundException extends NotFoundException {
  constructor(id: string, options?: HttpExceptionOptions) {
    super(`User with ID ${id} not found`, options);
  }
}

export const userWithIdNotFoundExceptionSample =
  new UserWithIdNotFoundException('18dasb-bwe785w-we48t9-ewbw8w');
