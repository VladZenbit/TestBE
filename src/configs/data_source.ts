import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig();
/**
 * use this dotenv.config() as typeorm does not understand the configuration module (@nestjs/config) from nestjs
 */
const getMigrationConfig = (): DataSourceOptions => {
  const environment = process.env.NODE_ENV;

  return {
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities:
      environment === 'test'
        ? ['src/**/*.entity{.js,.ts}']
        : ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    synchronize: process.env.TYPEORM_SYNC === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    migrationsRun: process.env.RUN_MIGRATIONS === 'true',
    migrationsTransactionMode: 'each',
    dropSchema: process.env.DROP_SCHEMA === 'true',
    ...(['staging', 'production'].includes(environment) && {
      ssl: { rejectUnauthorized: false },
    }),
  };
};

export default new DataSource(getMigrationConfig());
