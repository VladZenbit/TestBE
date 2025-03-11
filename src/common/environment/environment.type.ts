import type { z } from 'zod';

import { environmentSchema } from './environment.schema';

export type Env = z.infer<typeof environmentSchema> & {
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
};
