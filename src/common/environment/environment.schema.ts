import { capitalCase } from 'change-case';
import { z } from 'zod';

import { ZOD_MS_TYPE } from './constants/zod-ms-type.const';
import { ZOD_PORT_TYPE } from './constants/zod-port-type.const';
import { ZOD_S_TYPE } from './constants/zod-s-type.const';
import { NodeEnv } from './environment.enum';

export const environmentSchema = z.object({
  PROJECT_NAME: z
    .string()
    .default(capitalCase(process.env.npm_package_name ?? 'PROJECT')),
  NODE_ENV: z.nativeEnum(NodeEnv),
  PORT: ZOD_PORT_TYPE.default(3000),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: ZOD_PORT_TYPE.default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string().default('postgres'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: ZOD_PORT_TYPE.default(6379),
  REDIS_PASSWORD: z.string().default(''),
  SESSION_SECRET: z.string(),
  SESSION_DURATION: ZOD_MS_TYPE.default('1h'),
  SESSION_REMEMBER_DURATION: ZOD_MS_TYPE.default('7d'),
  REQUEST_ENTITY_SIZE_LIMIT: z.string().default('15mb'),
  AUTHORIZATION_THROTTLE_TTL: ZOD_MS_TYPE.default('1m'),
  AUTHORIZATION_THROTTLE_LIMIT: z.coerce.number().default(10),
  PASSWORD_SALT_ROUNDS: z.coerce.number().min(6).default(12),
  RESET_PASSWORD_TOKEN_EXPIRE_IN: ZOD_MS_TYPE.default('1d'),
  RESET_PASSWORD_TOKEN_RESEND_IN: ZOD_MS_TYPE.default('30s'),
  EMAIL_VERIFICATION_TOKEN_EXPIRE_IN: ZOD_MS_TYPE.default('1d'),
  EMAIL_VERIFICATION_TOKEN_RESEND_IN: ZOD_MS_TYPE.default('30s'),
  SHARE_LINK_TOKEN_EXPIRE_IN: ZOD_S_TYPE.default('30d'),
  RESET_PASSWORD_FRONT_END_PATH: z.string().default('/auth/set-new-password'),
  EMAIL_VERIFICATION_FRONT_END_REDIRECT_PATH_SUCCESS: z
    .string()
    .default('/auth/email-verification-success'),
  EMAIL_VERIFICATION_FRONT_END_REDIRECT_PATH_FAIL: z
    .string()
    .default('/auth/email-verification-fail'),
  API_GLOBAL_PREFIX: z.string().default('api'),
  DOCS_PATH: z.string().default('docs'),
  SMTP_HOST: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_FROM: z.string(),
  BUCKET_AWS_ACCESS_KEY_ID: z.string(),
  BUCKET_AWS_SECRET_ACCESS_KEY: z.string(),
  BUCKET_AWS_DEFAULT_REGION: z.string(),
  AWS_DEFAULT_ENDPOINT: z.string().optional(),
  BUCKET_AWS_S3_BUCKET: z.string(),
});
