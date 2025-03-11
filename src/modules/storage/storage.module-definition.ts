import { ConfigurableModuleBuilder } from '@nestjs/common';

import { StorageModuleConfig } from './types/storage-module-config.type';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: STORAGE_MODULE_OPTIONS_TOKEN,
} = new ConfigurableModuleBuilder<StorageModuleConfig>()
  .setExtras<{
    isGlobal?: boolean;
  }>({ isGlobal: false }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  }))
  .build();
