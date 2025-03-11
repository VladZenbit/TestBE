import type { HttpExceptionOptions } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

export class DeletionFailedException extends InternalServerErrorException {
  constructor(fileNames: string[], options?: HttpExceptionOptions) {
    super(`Deletion of files '${fileNames.join(', ')}' failed`, options);
  }
}

export const deletionFailedExceptionSample = new DeletionFailedException([
  'some-file-name.ext',
]);
