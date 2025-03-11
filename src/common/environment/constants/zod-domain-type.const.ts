import z from 'zod';

export const ZOD_DOMAIN_TYPE = z
  .string()
  .regex(/^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,63}$/);
