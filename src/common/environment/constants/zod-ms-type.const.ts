import parseDuration from 'parse-duration';
import z from 'zod';

export const ZOD_MS_TYPE = z
  .string()
  .refine((value) => parseDuration(value), {
    message: 'Invalid syntax, see https://www.npmjs.com/package/parse-duration',
  })
  .transform((value) => parseDuration(value));
