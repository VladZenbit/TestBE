import parseDuration from 'parse-duration';
import z from 'zod';

export const ZOD_S_TYPE = z
  .string()
  .refine((value) => parseDuration(value) !== null, {
    message: 'Invalid syntax, see https://www.npmjs.com/package/parse-duration',
  })
  .transform((value) => {
    const durationInMs = parseDuration(value);

    return durationInMs ? Math.floor(durationInMs / 1000) : undefined;
  });
