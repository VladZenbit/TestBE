import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';

import { S3_CLIENT_PROVIDER_TOKEN } from './constants/s3-client-provider-token.const';
import {
  STORAGE_MODULE_OPTIONS_TOKEN,
  ConfigurableModuleClass,
} from './storage.module-definition';
import { StorageService } from './storage.service';
import { StorageModuleConfig } from './types/storage-module-config.type';

@Module({
  providers: [
    {
      inject: [STORAGE_MODULE_OPTIONS_TOKEN],
      provide: S3_CLIENT_PROVIDER_TOKEN,
      useFactory: (config: StorageModuleConfig): S3Client =>
        new S3Client({
          region: config.region,
          endpoint: config.endpoint,
          forcePathStyle: true,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        }),
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule extends ConfigurableModuleClass {}
