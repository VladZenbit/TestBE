import type { HttpExceptionOptions } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

export class CheckoutSessionCreationFailedException extends BadRequestException {
  constructor(options?: HttpExceptionOptions) {
    super(`Checkout session creation failed exception`, options);
  }
}
