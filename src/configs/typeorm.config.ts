import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const dataSource = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: configService.get<'postgres'>('DB_TYPE'),
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [join(__dirname, '..', '/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', '/migrations/*{.ts,.js}')],
  synchronize: configService.get<string>('TYPEORM_SYNC') === 'true',
  logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
  maxQueryExecutionTime: configService.get<number>('TYPEORM_EXECUTIONTIME'),
  migrationsRun: configService.get<string>('RUN_MIGRATIONS') === 'true',
  migrationsTransactionMode: 'each',
  dropSchema: configService.get<string>('DROP_SCHEMA') === 'true',
  ...(['staging', 'production'].includes(
    configService.get<string>('NODE_ENV'),
  ) && { ssl: { rejectUnauthorized: false } }),
});
