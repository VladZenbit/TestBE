import type { HttpExceptionOptions } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

export class MovieNotFoundException extends NotFoundException {
  constructor(id: string, options?: HttpExceptionOptions) {
    super(`Movie with ID ${id} not found`, options);
  }
}

export const movieWithNotFoundExceptionSample = new MovieNotFoundException(
  '18dasb-bwe785w-we48t9-ewbw8w',
);
