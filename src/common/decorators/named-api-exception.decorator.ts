import { buildTemplatedApiExceptionDecorator } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { HttpException } from '@nestjs/common';

export const ApiNamedException = buildTemplatedApiExceptionDecorator(
  {
    statusCode: '$status',
    message: '$description',
    error: '$name',
  },
  {
    placeholders: {
      name: {
        exceptionMatcher: () => HttpException,
        resolver: (exception: HttpException) => exception.name,
      },
    },
  },
);
