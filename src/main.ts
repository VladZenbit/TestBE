import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationException } from './common/exceptions/validation.exception';

const PORT = process.env.PORT || 3000

const logger = new Logger('Main');

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const environment = process.env.NODE_ENV;

    app.set('trust proxy', 1);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type'],
      origin: [process.env.CORS_ORIGIN],
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        validateCustomDecorators: true,
        exceptionFactory: (errors): ValidationException =>
          new ValidationException(errors),
      }),
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        excludeExtraneousValues: true,
      }),
    );

    app.setGlobalPrefix('api');

    if (environment !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('Movie')
        .setDescription('Movie Routes Documentation')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
        .addSecurityRequirements('bearer')
        .build();
      const document = SwaggerModule.createDocument(app, config);

      SwaggerModule.setup('api/docs', app, document);
    }

    await app.listen(PORT);
  } catch (error) {
    logger.error(error);
  }
}

bootstrap()
  .then(() => logger.verbose('the server is running on port ' + PORT))
  .catch((error) => logger.error('the server crashed with an error:', error));
