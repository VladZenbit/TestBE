import { BadRequestException } from '@nestjs/common';

export const badRequestExceptionSample = new BadRequestException(
  'Expected double-quoted property name in JSON at position 112',
);
