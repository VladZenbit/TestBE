import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Env } from './common/environment/environment.type';
import { dataSource } from './configs/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module';
import { MovieModule } from './modules/movie/movie.module';
import { StorageModule } from './modules/storage/storage.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dataSource,
    }),
    StorageModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        region: configService.get('BUCKET_AWS_DEFAULT_REGION', { infer: true }),
        bucket: configService.get('BUCKET_AWS_S3_BUCKET', { infer: true }),
        endpoint: configService.get('AWS_DEFAULT_ENDPOINT', { infer: true }),
        accessKeyId: configService.get('BUCKET_AWS_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: configService.get('BUCKET_AWS_SECRET_ACCESS_KEY', {
          infer: true,
        }),
      }),
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    HttpModule,
    HealthcheckModule,
    MovieModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
