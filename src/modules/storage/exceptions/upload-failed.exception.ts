import type { HttpExceptionOptions } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

export class UploadFailedException extends InternalServerErrorException {
  constructor(fileName: string, options?: HttpExceptionOptions) {
    super(`Upload of file '${fileName}' failed`, options);
  }
}

export const uploadFailedExceptionSample = new UploadFailedException(
  'some-file-name.ext',
);
